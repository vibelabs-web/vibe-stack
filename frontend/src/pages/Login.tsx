import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import client from '../api/client';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Toast } from '../components/common/Toast';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('username', email); // OAuth2PasswordRequestForm expects username
            formData.append('password', password);

            const response = await client.post('/auth/login', formData, {
                headers: { 'Content-Type': 'multipart/form-data' } // Must send as form-data
            });

            const { access_token, user } = response.data;
            login(access_token, user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || '이메일 또는 비밀번호가 맞지 않아요 😢');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto' }}>
            <Card>
                <h1 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.5rem', fontWeight: 800 }}>로그인</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Input
                        label="이메일"
                        type="email"
                        placeholder="이메일을 입력해주세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="비밀번호"
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p style={{ color: 'var(--heart-red)', fontSize: '0.875rem' }}>{error}</p>}
                    <Button type="submit" fullWidth isLoading={isLoading}>
                        로그인하기
                    </Button>
                </form>
                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.875rem' }}>
                    아직 계정이 없으신가요? <Link to="/register" style={{ color: 'var(--vibe-orange)' }}>회원가입</Link>
                </div>
            </Card>
            {error && <Toast message={error} type="error" onClose={() => setError('')} />}
        </div>
    );
};
