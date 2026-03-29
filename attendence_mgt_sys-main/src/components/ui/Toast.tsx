import { useEffect } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastProps {
    toast: ToastData;
    onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
    useEffect(() => {
        const duration = toast.duration || getDefaultDuration(toast.type);
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(toast.id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [toast, onClose]);

    const getDefaultDuration = (type: ToastType): number => {
        switch (type) {
            case 'success':
            case 'info':
                return 3000;
            case 'error':
            case 'warning':
                return 5000;
            default:
                return 3000;
        }
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '';
        }
    };

    return (
        <div className={`toast toast-${toast.type}`}>
            <div className="toast-content">
                <span className="toast-icon">{getIcon()}</span>
                <span className="toast-message">{toast.message}</span>
            </div>
            <button
                className="toast-close"
                onClick={() => onClose(toast.id)}
                aria-label="Close notification"
            >
                ✕
            </button>
        </div>
    );
}
