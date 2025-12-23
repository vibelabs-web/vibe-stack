import React from 'react';
import { Card } from './Card';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
        >
            <div onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '500px' }}>
                <Card>
                    {title && <h2 style={{ marginTop: 0, marginBottom: '16px' }}>{title}</h2>}
                    {children}
                </Card>
            </div>
        </div>
    );
};
