import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = 'http://localhost:8000/api/posts';

// Helper to get token (if not using cookies/interceptors)
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});

export interface Post {
    id: number;
    title: string;
    content: string;
    image_url?: string;
    author_id: number;
    created_at: string;
    likes_count: number;
    comments_count: number;
    tags?: string[];
    author?: {
        nickname: string;
        avatar_url: string;
    };
}

export interface CreatePostData {
    title: string;
    content: string;
    image_url?: string;
    category_id?: number;
    tags?: string[];
}

export const createPost = async (data: CreatePostData): Promise<Post> => {
    const response = await api.post('/posts', data);
    return response.data;
};

export const getPosts = async (params?: { limit?: number; offset?: number; sort?: string }): Promise<Post[]> => {
    const response = await api.get('/posts', { params });
    return response.data;
};

export const getPostById = async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
};
