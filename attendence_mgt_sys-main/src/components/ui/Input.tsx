import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className="input-wrapper">
            {label && <label className="input-label">{label}</label>}
            <input
                className={cn('input', error && 'input-error', className)}
                {...props}
            />
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
}
