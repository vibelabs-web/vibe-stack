import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { getRanking } from '../api/users';
import { getImageUrl } from '../utils/image';
import styles from './Ranking.module.css';

interface UserRank {
    id: number;
    nickname: string;
    avatar_url: string;
    points: number;
    level: string;
}

export const Ranking: React.FC = () => {
    const [filter, setFilter] = useState<'daily' | 'weekly' | 'all'>('weekly');
    const [users, setUsers] = useState<UserRank[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRanking = async () => {
            setIsLoading(true);
            try {
                const data = await getRanking(filter);
                // Ensure data is array
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error("Failed to fetch ranking", error);
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRanking();
    }, [filter]);

    const top3 = users.slice(0, 3);
    const rest = users.slice(3);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>명예의 전당 🏆</h1>
                    <p className={styles.subtitle}>가장 활발하게 활동하는 커뮤니티 멤버들을 소개합니다</p>
                </div>

                <div className={styles.filters}>
                    <button
                        className={`${styles.filterBtn} ${filter === 'daily' ? styles.filterBtnActive : ''}`}
                        onClick={() => setFilter('daily')}
                    >
                        일간
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'weekly' ? styles.filterBtnActive : ''}`}
                        onClick={() => setFilter('weekly')}
                    >
                        주간
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        전체
                    </button>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>로딩 중...</div>
                ) : (
                    <>
                        <div className={styles.podium}>
                            {/* Rank 2 */}
                            {top3[1] && (
                                <div className={`${styles.podiumItem} ${styles.rank2}`}>
                                    <div className={styles.podiumAvatar} style={{ backgroundImage: `url('${getImageUrl(top3[1].avatar_url)}')` }} />
                                    <div className={styles.podiumName}>{top3[1].nickname}</div>
                                    <div className={styles.podiumPoints}>{top3[1].points} pts</div>
                                    <div className={styles.podiumBase}>
                                        <span className={styles.rankNumber}>2</span>
                                    </div>
                                </div>
                            )}

                            {/* Rank 1 */}
                            {top3[0] && (
                                <div className={`${styles.podiumItem} ${styles.rank1}`}>
                                    <div className="material-symbols-outlined" style={{ color: '#ffd700', fontSize: '2rem', marginBottom: '0.5rem' }}>crown</div>
                                    <div className={styles.podiumAvatar} style={{ backgroundImage: `url('${getImageUrl(top3[0].avatar_url)}')` }} />
                                    <div className={styles.podiumName}>{top3[0].nickname}</div>
                                    <div className={styles.podiumPoints}>{top3[0].points} pts</div>
                                    <div className={styles.podiumBase}>
                                        <span className={styles.rankNumber}>1</span>
                                    </div>
                                </div>
                            )}

                            {/* Rank 3 */}
                            {top3[2] && (
                                <div className={`${styles.podiumItem} ${styles.rank3}`}>
                                    <div className={styles.podiumAvatar} style={{ backgroundImage: `url('${getImageUrl(top3[2].avatar_url)}')` }} />
                                    <div className={styles.podiumName}>{top3[2].nickname}</div>
                                    <div className={styles.podiumPoints}>{top3[2].points} pts</div>
                                    <div className={styles.podiumBase}>
                                        <span className={styles.rankNumber}>3</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.list}>
                            {rest.length > 0 ? rest.map((user, index) => (
                                <div key={user.id} className={styles.listItem}>
                                    <div className={styles.listRank}>{index + 4}</div>
                                    <div className={styles.listAvatar} style={{ backgroundImage: `url('${getImageUrl(user.avatar_url)}')` }} />
                                    <div className={styles.listInfo}>
                                        <div className={styles.listName}>{user.nickname}</div>
                                        <div className={styles.listLevel}>{user.level || 'Member'}</div>
                                    </div>
                                    <div className={styles.listPoints}>{user.points} pts</div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted-light)' }}>
                                    랭킹 데이터가 없습니다.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};
