# Twilio Verify OTP Integration

This project uses **Twilio Verify** for real-time OTP (One-Time Password) verification.

## 📱 How It Works

1. **Send OTP**: When a user requests an OTP, the frontend calls `/api/otp/send`
2. **Twilio Sends SMS**: The backend uses Twilio Verify to send an SMS with a 6-digit code
3. **User Enters Code**: User receives SMS and enters the code in your app
4. **Verify OTP**: Frontend calls `/api/otp/verify` to check if the code is valid
5. **Success**: If valid, user can proceed with the action

## 🚀 Running the Application

### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev:all
```

This starts:
- **Vite dev server** on `http://localhost:5173` (frontend)
- **OTP API server** on `http://localhost:3001` (backend)

### Option 2: Run Separately
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - OTP API
npm run dev:api
```

## 🔑 Environment Variables

Make sure your `.env.local` has:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_SERVICE_ID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📊 API Endpoints

### POST /api/otp/send
Send OTP to a phone number.

**Request:**
```json
{
  "phoneNumber": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "status": "pending",
  "to": "+919876543210"
}
```

### POST /api/otp/verify
Verify the OTP code.

**Request:**
```json
{
  "phoneNumber": "+919876543210",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "status": "approved"
}
```

## 📝 Phone Number Format

Phone numbers should be in **E.164 format**: `+[country code][number]`

Examples:
- India: `+919876543210`
- USA: `+14155552671`

The backend automatically adds `+91` (India) if no country code is provided.

## 🧪 Testing

1. Update a teacher/student profile or apply for leave
2. Check your console for OTP send logs
3. Check your phone for the SMS (should arrive in 5-30 seconds)
4. Enter the 6-digit code
5. The code is valid for **5 minutes**

## ⚙️ Features

- ✅ Real SMS via Twilio Verify
- ✅ Automatic OTP generation
- ✅ 5-minute expiry
- ✅ Built-in rate limiting (Twilio handles this)
- ✅ Secure verification
- ✅ Phone number formatting

## 🔒 Security Notes

- Never commit `.env.local` with real credentials
- The backend must run server-side (never expose Twilio credentials in frontend)
- OTP codes expire after 5 minutes
- Twilio Verify includes built-in fraud prevention

## 💰 Twilio Pricing

- **Trial**: Free credits to test
- **Production**: ~$0.05 per verification (India)
- Check current pricing: https://www.twilio.com/verify/pricing
