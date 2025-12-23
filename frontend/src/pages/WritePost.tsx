import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';
import { uploadFile } from '../api/files';
import { createPost } from '../api/posts'; // Assuming this API exists
import { Toast } from '../components/common/Toast';
import styles from './WritePost.module.css';

export const WritePost: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const data = await uploadFile(file);
            let fullUrl = data.url;
            if (data.url.startsWith('/uploads')) {
                fullUrl = `http://localhost:8000${data.url}`;
            }
            setImageUrl(fullUrl);
            setToast({ message: 'Image uploaded successfully.', type: 'success' });
        } catch (error) {
            console.error(error);
            setToast({ message: 'Failed to upload image.', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setToast({ message: '제목과 내용을 모두 입력해주세요.', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        try {
            await createPost({
                title,
                content,
                image_url: imageUrl,
                category_id: 1, // Default to 'General' or similar for now
                tags: [] // Parse tags from content or add separate input
            });
            setToast({ message: '게시글이 성공적으로 작성되었습니다!', type: 'success' });
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error(error);
            setToast({ message: '게시글 작성에 실패했습니다.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Redirect if not logged in
    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

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

                <div className={styles.card}>
                    <h1 className={styles.title}>새 글 작성</h1>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>제목</label>
                            <input
                                className={styles.input}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요"
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label className={styles.label}>커버 이미지 (선택)</label>

                            {!imageUrl ? (
                                <div
                                    className={styles.fileUploadArea}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>add_photo_alternate</span>
                                    <span>클릭하여 커버 이미지 업로드</span>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                    />
                                    {isUploading && <span style={{ marginTop: '0.5rem', color: 'var(--color-primary)' }}>업로드 중...</span>}
                                </div>
                            ) : (
                                <div className={styles.previewContainer}>
                                    <img src={imageUrl} alt="Cover Preview" className={styles.previewImage} />
                                    <button
                                        type="button"
                                        className={styles.removeImageBtn}
                                        onClick={() => setImageUrl('')}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label className={styles.label}>내용</label>
                            <textarea
                                className={styles.textarea}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="지식이나 질문을 공유해보세요..."
                                required
                            />
                        </div>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => navigate(-1)}
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting || isUploading}
                            >
                                {isSubmitting ? '작성 중...' : '글 작성하기'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};
