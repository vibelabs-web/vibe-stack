import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import client from '../api/client';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Toast } from '../components/common/Toast';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [formData, setFormData] = useState({
        email: '',
        nickname: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않아요');
            return;
        }

        setIsLoading(true);

        try {
            const response = await client.post('/auth/register', {
                email: formData.email,
                nickname: formData.nickname,
                password: formData.password
            });

            const { access_token, user } = response.data;
            login(access_token, user);
            navigate('/'); // Redirect to home on success
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            if (typeof detail === 'string') {
                setError(detail);
            } else if (Array.isArray(detail)) {
                // Pydantic validation error array
                const firstError = detail[0];
                const field = firstError.loc[firstError.loc.length - 1];
                setError(`${field}: ${firstError.msg}`);
            } else {
                setError('회원가입 중 문제가 생겼어요');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto' }}>
            <Card>
                <h1 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.5rem', fontWeight: 800 }}>회원가입</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Input
                        label="이메일"
                        type="email"
                        name="email"
                        placeholder="example@vibelabs.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="닉네임"
                        name="nickname"
                        placeholder="사용하실 닉네임을 알려주세요"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="비밀번호"
                        type="password"
                        name="password"
                        placeholder="8자 이상 입력해주세요"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                    />
                    <Input
                        label="비밀번호 확인"
                        type="password"
                        name="confirmPassword"
                        placeholder="한 번 더 입력해주세요"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {error && <p style={{ color: 'var(--heart-red)', fontSize: '0.875rem' }}>{error}</p>}
                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Vibelabs 시작하기
                    </Button>
                </form>
                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.875rem' }}>
                    이미 계정이 있으신가요? <Link to="/login" style={{ color: 'var(--vibe-orange)' }}>로그인</Link>
                </div>
            </Card>
            {error && <Toast message={error} type="error" onClose={() => setError('')} />}
        </div>
    );
};
