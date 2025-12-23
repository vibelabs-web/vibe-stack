import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { updateMyProfile } from '../api/users';
import { uploadFile } from '../api/files';
import { Layout } from '../components/layout/Layout';
import { Toast } from '../components/common/Toast';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/image';
import styles from './Profile.module.css';

export const Profile: React.FC = () => {
    const { user, updateUser } = useAuthStore();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Form state
    const [nickname, setNickname] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);

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
            let fullUrl = data.url;
            console.log("Uploaded file URL:", fullUrl); // Debug log

            // Ensure absolute URL if backend returns relative path
            if (fullUrl.startsWith('/uploads')) {
                fullUrl = `http://localhost:8005${fullUrl}`;
            }

            setAvatarUrl(fullUrl);
            setToast({ message: '이미지가 업로드되었습니다. 저장 버튼을 눌러 적용하세요.', type: 'success' });
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
            setToast({ message: '프로필이 수정되었습니다.', type: 'success' });
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
        <Layout>
            <div className={styles.container}>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                {/* Left Sidebar: Profile Card */}
                <aside className={styles.profileCard}>
                    <div className={styles.avatarWrapper}>
                        <div
                            className={styles.avatar}
                            style={{ backgroundImage: `url('${isEditing ? getImageUrl(avatarUrl) : getImageUrl(user.avatar_url)}')` }}
                        />
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
                                    className={styles.editButton}
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>camera_alt</span>
                                </button>
                            </>
                        )}
                    </div>

                    <h2 className={styles.nickname}>{nickname}</h2>
                    <p className={styles.handle}>@{nickname.toLowerCase()}</p>

                    <p className={styles.bio}>
                        {bio || "자기소개가 없습니다."}
                    </p>

                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>0</span>
                            <span className={styles.statLabel}>게시글</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>0</span>
                            <span className={styles.statLabel}>좋아요</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>-</span>
                            <span className={styles.statLabel}>랭킹</span>
                        </div>
                    </div>

                    <div className={styles.joinDate}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>calendar_today</span>
                        <span>가입일: {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className={styles.mainContent}>
                    {isEditing ? (
                        <div className={styles.contentCard}>
                            <h3 className={styles.sectionTitle}>
                                <span className="material-symbols-outlined">edit</span>
                                프로필 수정
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>닉네임</label>
                                    <input
                                        className={styles.input}
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="닉네임을 입력하세요"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>프로필 이미지 URL</label>
                                    <input
                                        className={styles.input}
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        placeholder="왼쪽의 카메라 아이콘을 클릭하거나 URL을 입력하세요"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>자기소개</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="자신을 자유롭게 소개해주세요..."
                                    />
                                </div>

                                <div className={styles.actions}>
                                    <button
                                        type="button"
                                        className={styles.cancelBtn}
                                        onClick={() => {
                                            setIsEditing(false);
                                            setNickname(user.nickname);
                                            setBio(user.bio || '');
                                            setAvatarUrl(user.avatar_url || '');
                                        }}
                                    >
                                        취소
                                    </button>
                                    <button type="submit" className={styles.saveBtn} disabled={isLoading}>
                                        {isLoading ? '저장 중...' : '변경사항 저장'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className={styles.contentCard}>
                            <div className={styles.sectionTitle} style={{ justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="material-symbols-outlined">article</span>
                                    <span>내 활동</span>
                                </div>
                                <button className={styles.cancelBtn} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => setIsEditing(true)}>
                                    프로필 수정
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', color: 'var(--text-muted-light)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.5 }}>post_add</span>
                                <p>아직 활동 내역이 없습니다. 첫 글을 작성해보세요!</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </Layout>
    );
};
