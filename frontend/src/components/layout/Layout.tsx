import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'var(--soft-gray)'
        }}>
            <Header />
            <main style={{
                flex: 1,
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '32px 16px',
                boxSizing: 'border-box'
            }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};
