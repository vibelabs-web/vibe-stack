import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import { Button } from '../components/common/Button';

export const Home: React.FC = () => {
    const { user } = useAuthStore();

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 200px)', // Adjust for header/footer
            textAlign: 'center'
        }}>
            <section style={{
                marginBottom: '48px',
                maxWidth: '800px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--deep-blue)', marginBottom: '1.5rem', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                    함께 성장의 즐거움을,<br />
                    <span style={{
                        background: 'var(--primary-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                        marginTop: '0.5rem'
                    }}>Vibelabs Community</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#4A5568', lineHeight: 1.6 }}>
                    혼자 하는 코딩 공부가 외롭다면? <br />
                    오늘 배운 것을 공유하고 서로 응원해봐요! 🍊
                </p>
            </section>

            {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--deep-blue)' }}>반가워요, {user.nickname}님! 👋</h2>
                        <p style={{ color: '#718096', fontSize: '1.1rem' }}>오늘의 배움을 기록해보러 갈까요?</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <Button size="large">TIL 작성하기</Button>
                        <Button size="large" variant="secondary">다른 친구들 보기</Button>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link to="/register">
                        <Button size="large">3초만에 시작하기</Button>
                    </Link>
                    <Link to="/login">
                        <Button size="large" variant="ghost">로그인</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};
