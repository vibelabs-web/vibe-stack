import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';
import { getPosts, type Post } from '../api/posts';
import { getRanking } from '../api/users';
import { getImageUrl } from '../utils/image';
import styles from './Home.module.css';

interface RankUser {
    id: string;
    nickname: string;
    avatar_url?: string;
}

export const Home: React.FC = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('newest');
    const [posts, setPosts] = useState<Post[]>([]);
    const [topLearners, setTopLearners] = useState<RankUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const data = await getPosts();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, [activeTab]);

    useEffect(() => {
        const fetchTopLearners = async () => {
            try {
                const data = await getRanking('weekly');
                setTopLearners(data.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch ranking", error);
            }
        };
        fetchTopLearners();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '방금 전';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return '방금 전';
        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;
        return date.toLocaleDateString('ko-KR');
    };

    return (
        <Layout fullWidth>
            <div className={styles.container}>
                {/* Left Sidebar */}
                <aside className={styles.leftSidebar}>
                    {user ? (
                        <div className={styles.miniProfile}>
                            <div
                                className={styles.miniAvatar}
                                style={{ backgroundImage: `url('${getImageUrl(user.avatar_url)}')` }}
                            />
                            <div>
                                <div className={styles.profileName}>{user.nickname}</div>
                                <div className={styles.profileHandle}>@{user.nickname?.toLowerCase()}</div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.miniProfile}>
                            <div className={styles.joinCard}>
                                <h3 className={styles.joinTitle}>커뮤니티 가입하기</h3>
                                <p className={styles.joinDesc}>
                                    개발자들과 지식을 공유하고 함께 성장하세요!
                                </p>
                                <div className={styles.authLinks}>
                                    <Link to="/login" className={styles.authLink}>로그인</Link>
                                    <span style={{ color: '#ccc' }}>/</span>
                                    <Link to="/register" className={styles.authLink}>회원가입</Link>
                                </div>
                            </div>
                        </div>
                    )}

                    <nav className={styles.navMenu}>
                        <Link to="/" className={`${styles.navItem} ${styles.navItemActive}`}>
                            <span className="material-symbols-outlined">home</span>
                            홈
                        </Link>
                        <Link to="/board" className={styles.navItem}>
                            <span className="material-symbols-outlined">edit_note</span>
                            게시판
                        </Link>
                        <Link to="/ranking" className={styles.navItem}>
                            <span className="material-symbols-outlined">leaderboard</span>
                            랭킹
                        </Link>
                        <Link to="/profile" className={styles.navItem}>
                            <span className="material-symbols-outlined">person</span>
                            내 프로필
                        </Link>
                        <Link to="/bookmarks" className={styles.navItem}>
                            <span className="material-symbols-outlined">bookmark</span>
                            북마크
                        </Link>
                    </nav>
                </aside>

                {/* Main Feed */}
                <main className={styles.mainFeed}>
                    {/* Feed Tabs */}
                    <div className={styles.feedTabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'newest' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('newest')}
                        >
                            Newest
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'popular' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('popular')}
                        >
                            Top Voted
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'trending' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('trending')}
                        >
                            Trending
                        </button>
                    </div>

                    {/* Posts */}
                    {isLoading ? (
                        <div className={styles.emptyState}>
                            <span className="material-symbols-outlined">hourglass_empty</span>
                            <p>로딩 중...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <article key={post.id} className={styles.postCard}>
                                <div className={styles.postContent}>
                                    <div className={styles.postHeader}>
                                        <div className={styles.authorInfo}>
                                            <div
                                                className={styles.authorAvatar}
                                                style={{ backgroundImage: `url('${getImageUrl(post.author?.avatar_url)}')` }}
                                            />
                                            <div>
                                                <div className={styles.authorName}>
                                                    @{post.author?.nickname || 'unknown'}
                                                    <span className={styles.authorBadge}>LEARNER</span>
                                                </div>
                                                <div className={styles.authorMeta}>
                                                    {formatDate(post.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className={styles.postTitle}>{post.title}</h2>
                                    <p className={styles.postSnippet}>
                                        {post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}
                                    </p>

                                    {post.image_url && (
                                        <div
                                            style={{
                                                backgroundImage: `url(${post.image_url})`,
                                                height: '180px',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderRadius: '8px',
                                                margin: '0.75rem 0'
                                            }}
                                        />
                                    )}

                                    <div className={styles.tags}>
                                        <span className={styles.tag}>#React</span>
                                        <span className={styles.tag}>#JavaScript</span>
                                    </div>

                                    <div className={styles.divider} />

                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn}>
                                            <span className="material-symbols-outlined">favorite</span>
                                            {post.likes_count || 0}
                                        </button>
                                        <button className={styles.actionBtn}>
                                            <span className="material-symbols-outlined">chat_bubble</span>
                                            {post.comments_count || 0}
                                        </button>
                                        <button className={styles.actionBtn}>
                                            <span className="material-symbols-outlined">bookmark</span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <span className="material-symbols-outlined">post_add</span>
                            <p>아직 게시글이 없습니다.<br />첫 글을 작성해보세요!</p>
                        </div>
                    )}
                </main>

                {/* Right Sidebar */}
                <aside className={styles.rightSidebar}>
                    {/* Daily Vibe */}
                    <div className={`${styles.widget} ${styles.dailyVibe}`}>
                        <h3 className={styles.widgetTitle}>Daily Vibe</h3>
                        <p className={styles.quoteText}>
                            "오늘 작성한 한 줄의 코드가 내일의 나를 만든다. 포기하지 말고 꾸준히 기록하세요!"
                        </p>
                        <div className={styles.quoteAuthor}>- 오늘의 바이브</div>
                    </div>

                    {/* Weekly Top Learners */}
                    <div className={styles.widget}>
                        <h3 className={styles.widgetTitle}>Weekly Top Learners</h3>
                        <div className={styles.topLearnersList}>
                            {topLearners.length > 0 ? (
                                topLearners.map((learner, index) => (
                                    <div key={learner.id} className={styles.topLearnerItem}>
                                        <div className={styles.topLearnerRank}>{index + 1}</div>
                                        <div
                                            className={styles.topLearnerAvatar}
                                            style={{ backgroundImage: `url('${getImageUrl(learner.avatar_url)}')` }}
                                        />
                                        <div className={styles.topLearnerInfo}>
                                            <div className={styles.topLearnerName}>{learner.nickname}</div>
                                            <div className={styles.topLearnerStats}>TIL 작성 중</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ fontSize: '0.8125rem', color: '#999' }}>
                                    아직 데이터가 없습니다
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trending Tags */}
                    <div className={styles.widget}>
                        <h3 className={styles.widgetTitle}>Trending Tags</h3>
                        <div className={styles.trendingTags}>
                            <span className={styles.trendingTag}>#javascript</span>
                            <span className={styles.trendingTag}>#react</span>
                            <span className={styles.trendingTag}>#typescript</span>
                            <span className={styles.trendingTag}>#nodejs</span>
                            <span className={styles.trendingTag}>#python</span>
                            <span className={styles.trendingTag}>#aws</span>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className={styles.footerLinks}>
                        <a href="#">이용약관</a> · <a href="#">개인정보처리방침</a> · <a href="#">문의하기</a>
                        <br />
                        © 2024 Vibelabs
                    </div>
                </aside>
            </div>
        </Layout>
    );
};
