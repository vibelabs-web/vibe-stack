import React, { type TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className={styles.wrapper}>
                {label && <label className={styles.label}>{label}</label>}
                <textarea
                    ref={ref}
                    className={`${styles.textarea} ${error ? styles.error : ''} ${className}`}
                    {...props}
                />
                {error && <span className={styles.errorText}>{error}</span>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
