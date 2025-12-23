const API_URL = "http://localhost:8000";

export const authService = {
    async login(username: string, password: string): Promise<boolean> {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const res = await fetch(`${API_URL}/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (!res.ok) {
                return false;
            }

            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    logout() {
        localStorage.removeItem('token');
    },

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    async getCurrentUser(): Promise<any | null> {
        const token = this.getToken();
        if (!token) return null;

        try {
            const res = await fetch(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) return null;
            return await res.json();
        } catch (error) {
            console.error("Error fetching current user:", error);
            return null;
        }
    }
};
