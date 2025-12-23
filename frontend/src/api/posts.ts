import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = 'http://localhost:8005/api/v1/posts'; // Adjust based on actual backend prefix

// Helper to get token (if not using cookies/interceptors)
const getAuthHeader = () => {
    // This depends on how auth is handled. If using httpOnly cookies, no header needed.
    // If using JWT in localStorage/Zustand:
    const token = localStorage.getItem('token'); // Or from store
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create axios instance if needed, or just use axios directly
const api = axios.create({
    baseURL: 'http://localhost:8005/api/v1',
    withCredentials: true, // If using cookies
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
