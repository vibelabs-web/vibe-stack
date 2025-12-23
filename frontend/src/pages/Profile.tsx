import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { updateMyProfile } from '../api/users';
import { uploadFile } from '../api/files';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Card } from '../components/common/Card';
import { Toast } from '../components/common/Toast';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

export const Profile: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Form state
    const [nickname, setNickname] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Initialize form with user data
        setNickname(user.nickname);
        setBio(user.bio || '');
        setAvatarUrl(user.avatar_url || '');
    }, [user, navigate]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const data = await uploadFile(file);
            // Construct full URL if relative
            // Assuming backend returns relative path like /uploads/...
            // We need to prepend API base URL's origin or handle it if it's cleaner. 
            // Ideally backend returns full URL or frontend knows the base.
            // For now, let's assume valid URL handling or just use the relative path if <img src> can handle it (it can if served from same origin or proxy)
            // But we are on localhost:5173 and api is localhost:8005. 
            // So we need to prepend http://localhost:8005 if the returned URL is relative string starting with /uploads.

            let fullUrl = data.url;
            if (data.url.startsWith('/uploads')) {
                fullUrl = `http://localhost:8005${data.url}`;
            }

            setAvatarUrl(fullUrl);
            setToast({ message: '이미지가 업로드되었습니다. 저장 버튼을 눌러 확정해주세요.', type: 'success' });
        } catch (error) {
            console.error(error);
            setToast({ message: '이미지 업로드에 실패했습니다.', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedUser = await updateMyProfile({
                nickname,
                bio,
                avatar_url: avatarUrl
            });

            updateUser(updatedUser);
            setIsEditing(false);
            setToast({ message: '프로필이 성공적으로 수정되었습니다.', type: 'success' });
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.detail || '프로필 수정에 실패했습니다.';
            setToast({ message: errorMessage, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--deep-blue)' }}>
                내 프로필
            </h1>

            <Card>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    <div
                        style={{
                            position: 'relative',
                            width: '120px',
                            height: '120px',
                            marginBottom: '1rem'
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            backgroundColor: '#E2E8F0',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '4px solid white',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            {(isEditing ? avatarUrl : user.avatar_url) ? (
                                <img
                                    src={isEditing ? avatarUrl : user.avatar_url}
                                    alt={user.nickname}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span style={{ fontSize: '2.5rem' }}>🍊</span>
                            )}
                        </div>

                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        right: '0',
                                        backgroundColor: 'var(--deep-blue)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {isUploading ? '...' : <Camera size={18} />}
                                </button>
                            </>
                        )}
                    </div>

                    {!isEditing && (
                        <>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{user.nickname}</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{user.email}</p>
                            {user.bio && (
                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '400px' }}>
                                    {user.bio}
                                </p>
                            )}
                        </>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="닉네임"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="닉네임을 입력하세요"
                            required
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Input
                                label="프로필 이미지 URL (직접 입력 또는 위의 카메라 버튼 클릭)"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="http://..."
                                disabled={isUploading}
                            />
                        </div>

                        <Textarea
                            label="한줄 소개"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="나를 표현하는 한마디를 적어보세요"
                            rows={3}
                        />

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setIsEditing(false);
                                    setNickname(user.nickname);
                                    setBio(user.bio || '');
                                    setAvatarUrl(user.avatar_url || '');
                                }}
                                fullWidth
                            >
                                취소
                            </Button>
                            <Button type="submit" isLoading={isLoading} fullWidth>
                                저장하기
                            </Button>
                        </div>
                    </form>
                ) : (
                    <Button onClick={() => setIsEditing(true)} fullWidth variant="secondary">
                        프로필 수정하기
                    </Button>
                )}
            </Card>
        </div>
    );
};
