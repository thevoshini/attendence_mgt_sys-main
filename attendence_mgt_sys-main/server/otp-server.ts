import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const router = express.Router();

const VERIFY_SERVICE_SID = process.env.TWILIO_SERVICE_ID;
const DEV_MODE = process.env.OTP_DEV_MODE === 'true';

// Send OTP
router.post('/otp/send', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Format phone number to E.164 format (+919876543210)
        const formattedPhone = phoneNumber.startsWith('+')
            ? phoneNumber
            : `+91${phoneNumber.replace(/^0+/, '')}`; // Default to India (+91)

        console.log('[OTP] Sending to:', formattedPhone);

        // DEV MODE: Skip Twilio, just pretend it worked
        if (DEV_MODE) {
            console.log('🔧 [DEV MODE] Skipping Twilio - Use any 6-digit code (e.g., 123456)');
            res.json({
                success: true,
                status: 'pending',
                to: formattedPhone,
                devMode: true,
                hint: 'Use any 6-digit code (e.g., 123456)'
            });
            return;
        }

        const verification = await client.verify.v2
            .services(VERIFY_SERVICE_SID!)
            .verifications.create({
                to: formattedPhone,
                channel: 'sms'
            });

        console.log('[OTP] Sent successfully:', verification.status);

        res.json({
            success: true,
            status: verification.status,
            to: formattedPhone
        });
    } catch (error: any) {
        console.error('[OTP] Send error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Verify OTP
router.post('/otp/verify', async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;

        if (!phoneNumber || !code) {
            return res.status(400).json({ error: 'Phone number and code are required' });
        }

        // Format phone number
        const formattedPhone = phoneNumber.startsWith('+')
            ? phoneNumber
            : `+91${phoneNumber.replace(/^0+/, '')}`;

        console.log('[OTP] Verifying:', formattedPhone, 'Code:', code);

        // DEV MODE: Accept any 6-digit code
        if (DEV_MODE) {
            const isValid = /^\d{6}$/.test(code); // Any 6 digits
            console.log(`🔧 [DEV MODE] Code validation: ${isValid ? 'APPROVED' : 'REJECTED'}`);
            res.json({
                success: isValid,
                status: isValid ? 'approved' : 'denied',
                devMode: true
            });
            return;
        }

        const verificationCheck = await client.verify.v2
            .services(VERIFY_SERVICE_SID!)
            .verificationChecks.create({
                to: formattedPhone,
                code: code
            });

        console.log('[OTP] Verification status:', verificationCheck.status);

        res.json({
            success: verificationCheck.status === 'approved',
            status: verificationCheck.status
        });
    } catch (error: any) {
        console.error('[OTP] Verify error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'OTP API' });
});

// Mount router for both local dev and Netlify functions
app.use('/api', router);
app.use('/.netlify/functions/api', router);

const PORT = process.env.PORT || 3001;

// Start the server for Render / local development
if (!process.env.NETLIFY) {
    app.listen(PORT, () => {
        console.log(`🚀 OTP API server running on http://localhost:${PORT}`);
        console.log(`📱 Twilio Verify Service: ${VERIFY_SERVICE_SID}`);
        if (DEV_MODE) {
            console.log(`🔧 DEV MODE ENABLED - Accepts any 6-digit code (123456, 999999, etc.)`);
            console.log(`   To use real SMS, set OTP_DEV_MODE=false in .env.local`);
        }
    });
}

export default app;
