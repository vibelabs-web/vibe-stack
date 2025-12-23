import client from './client';

export interface UserUpdateData {
    nickname?: string;
    bio?: string;
    avatar_url?: string;
}

export const updateMyProfile = async (data: UserUpdateData) => {
    const response = await client.put('/users/me', data);
    return response.data;
};

export const getMyProfile = async () => {
    const response = await client.get('/users/me');
    return response.data;
};

export const getRanking = async (period: 'daily' | 'weekly' | 'all' = 'weekly') => {
    // Assuming backend endpoint exists or stubbing for now
    // If backend doesn't implementation /ranking, this might fail, but removing mock data requires this structure.
    const response = await client.get(`/users/ranking`, { params: { period } });
    return response.data;
};
