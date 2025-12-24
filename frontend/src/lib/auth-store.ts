import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/services/auth.service';

interface User {
    id: number;
    email: string;
    is_active: boolean;
    is_admin: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (user, token) => {
                localStorage.setItem('token', token);
                set({ user, isAuthenticated: true });
            },

            logout: () => {
                authService.logout(); // Clears token from localStorage
                set({ user: null, isAuthenticated: false });
            },

            checkAuth: async () => {
                try {
                    const user = await authService.getCurrentUser();
                    if (user) {
                        set({ user, isAuthenticated: true });
                    } else {
                        // Token might be invalid or expired
                        set({ user: null, isAuthenticated: false });
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                    set({ user: null, isAuthenticated: false });
                }
            }
        }),
        {
            name: 'ecostore-auth',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
