import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { useAuthStore } from '../../store/authStore';

export const Header: React.FC = () => {
    const { user, logout } = useAuthStore();
    const isLoggedIn = !!user;

    return (
        <header style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #F1F5F9',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 16px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>🍊</span>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--deep-blue)' }}>Vibelabs</span>
                </Link>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {isLoggedIn ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: '#E2E8F0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span>🍊</span>
                                    )}
                                </div>
                                <span style={{ fontWeight: 600 }}>{user.nickname}</span>
                            </Link>
                            <Button size="small" variant="ghost" onClick={logout}>로그아웃</Button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <Button size="small" variant="primary">시작하기</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};
