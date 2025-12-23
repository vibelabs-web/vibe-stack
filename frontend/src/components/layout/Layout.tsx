import React from 'react';
import Header from './Header';
import { Footer } from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    fullWidth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'var(--bg-light)'
        }}>
            <Header />
            <main style={{
                flex: 1,
                width: '100%',
                maxWidth: fullWidth ? '100%' : '1280px',
                margin: '0 auto',
                padding: fullWidth ? '0' : '2rem 1rem',
                boxSizing: 'border-box'
            }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};
