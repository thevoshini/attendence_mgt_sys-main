import './Badge.css';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info';
}

export default function Badge({ children, variant = 'info' }: BadgeProps) {
    return (
        <span className={`badge badge-${variant}`}>
            {children}
        </span>
    );
}
