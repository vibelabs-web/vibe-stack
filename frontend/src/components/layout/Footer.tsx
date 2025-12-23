import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer style={{
            backgroundColor: 'white',
            borderTop: '1px solid #F1F5F9',
            padding: '32px 16px',
            marginTop: 'auto'
        }}>
            <div style={{
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: '#718096',
                fontSize: '0.875rem'
            }}>
                <p>© 2025 Vibelabs Community. 함께 성장하는 즐거움.</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <span>이용약관</span>
                    <span>개인정보처리방침</span>
                    <span>문의하기</span>
                </div>
            </div>
        </footer>
    );
};
