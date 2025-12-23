import React, { useEffect } from 'react';

// For brevity, we'll implement a simple inline style toast for now or use Portals later.
// This is a minimal implementation placeholder for the visual requirement.

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'var(--warm-green)',
        error: 'var(--heart-red)',
        info: 'var(--deep-blue)',
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: bgColors[type],
                color: 'white',
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 9999,
                fontWeight: 600,
                animation: 'slideUp 0.3s ease-out'
            }}
        >
            {message}
        </div>
    );
};
