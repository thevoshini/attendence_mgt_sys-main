import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import './Card.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export default function Card({ children, className, hover = false, ...props }: CardProps) {
    return (
        <div className={cn('card', hover && 'card-hover', className)} {...props}>
            {children}
        </div>
    );
}
