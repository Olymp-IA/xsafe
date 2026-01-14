import React from 'react';
import './TitaniumUI.css';

// Types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary';
    icon?: React.ReactNode;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

// Components

/**
 * Titanium Button
 * Industrial style button with hover effects.
 */
export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'default',
    icon,
    className = '',
    ...props
}) => {
    const variantClass = variant === 'primary' ? 'tm-btn-primary' : '';
    return (
        <button
            className={`tm-btn ${variantClass} ${className}`}
            {...props}
        >
            {icon && <span className="tm-icon">{icon}</span>}
            {children}
        </button>
    );
};

/**
 * Titanium Input
 * Dark themed input with industrial label.
 */
export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
    return (
        <div className={`tm-input-group ${className}`}>
            {label && <label className="tm-label">{label}</label>}
            <input className="tm-input" {...props} />
        </div>
    );
};

/**
 * Titanium Card
 * Panel component with accent border on hover.
 */
export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <article className={`tm-card ${className}`}>
            {children}
        </article>
    );
};

/**
 * Section Header
 * Standardized industrial header.
 */
export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
    <div style={{ marginBottom: '2rem', borderBottom: '1px solid #2A2A2A', paddingBottom: '1rem' }}>
        <h2 style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '1.5rem',
            margin: 0,
            color: '#E0E0E0'
        }}>
            {title}
        </h2>
        {subtitle && (
            <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.875rem',
                color: '#888',
                marginTop: '0.5rem',
                marginBottom: 0
            }}>
                {subtitle}
            </p>
        )}
    </div>
);

// Icon Placeholder (svg X icon wrapper)
export const XIcon = ({ size = 24, color = "currentColor" }: { size?: number, color?: string }) => (
    <img
        src="/assets/x-icon.svg"
        alt="X Icon"
        style={{ width: size, height: size }}
    />
);
