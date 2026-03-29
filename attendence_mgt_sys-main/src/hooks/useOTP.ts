import { useState } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

interface OTPState {
    sent: boolean;
    verified: boolean;
    loading: boolean;
    error: string | null;
    countdown: number;
}

/**
 * Custom hook for OTP verification using Twilio Verify
 */
export function useOTP() {
    const [state, setState] = useState<OTPState>({
        sent: false,
        verified: false,
        loading: false,
        error: null,
        countdown: 0,
    });

    const sendOTP = async (phoneNumber: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            console.log('[useOTP] Sending OTP to:', phoneNumber);

            const response = await fetch(`${API_BASE_URL}/otp/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            console.log('[useOTP] OTP sent successfully:', data.status);

            setState(prev => ({
                ...prev,
                sent: true,
                loading: false,
                countdown: 300, // 5 minute expiry
            }));

            // Start countdown
            const interval = setInterval(() => {
                setState(prev => {
                    if (prev.countdown <= 1) {
                        clearInterval(interval);
                        return { ...prev, countdown: 0 };
                    }
                    return { ...prev, countdown: prev.countdown - 1 };
                });
            }, 1000);

            return true;
        } catch (error: any) {
            console.error('[useOTP] Send error:', error.message);
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message || 'Failed to send OTP. Please try again.',
            }));
            return false;
        }
    };

    const verifyOTP = async (phoneNumber: string, otp: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            console.log('[useOTP] Verifying OTP for:', phoneNumber);

            const response = await fetch(`${API_BASE_URL}/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, code: otp }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Invalid OTP');
            }

            console.log('[useOTP] OTP verified successfully:', data.status);

            setState(prev => ({
                ...prev,
                verified: true,
                loading: false,
            }));

            return true;
        } catch (error: any) {
            console.error('[useOTP] Verify error:', error.message);
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message || 'Invalid OTP. Please try again.',
            }));
            return false;
        }
    };

    const reset = () => {
        setState({
            sent: false,
            verified: false,
            loading: false,
            error: null,
            countdown: 0,
        });
    };

    return {
        ...state,
        sendOTP,
        verifyOTP,
        reset,
    };
}
