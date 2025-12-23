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
