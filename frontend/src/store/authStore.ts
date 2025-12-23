import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import client from '../api/client';

interface User {
    id: string;
    email: string;
    nickname: string;
    bio?: string;
    avatar_url?: string;
    created_at: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,
            login: (token, user) => {
                // Set Axios default header
                client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                set({ token, user, error: null });
            },
            logout: () => {
                delete client.defaults.headers.common['Authorization'];
                set({ token: null, user: null, error: null });
            },
            updateUser: (updates) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null
                }));
            }
        }),
        {
            name: 'auth-storage', // local storage key
            partialize: (state) => ({ token: state.token, user: state.user }), // persist token and user
        }
    )
);

// Initialize axios header from storage
const state = JSON.parse(localStorage.getItem('auth-storage') || '{}');
if (state.state?.token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${state.state.token}`;
}
