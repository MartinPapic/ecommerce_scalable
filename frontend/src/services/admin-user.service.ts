import { authService } from "./auth.service";
import { AdminUser, SecurityLog, SupportTicket } from "@/models/admin-user";

const API_URL = "http://localhost:8000";


export const adminUserService = {
    async getUsers(): Promise<AdminUser[]> {
        // Simulating API delay
        // await new Promise(resolve => setTimeout(resolve, 800));

        // Use real API
        const token = authService.getToken();
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                // Fallback to mock if API fails (e.g. while server restarts)
                console.warn("API fetch failed, returning empty list");
                return [];
            }

            const data = await res.json();
            return data.map((u: any) => ({
                id: u.id,
                email: u.email,
                name: u.email.split("@")[0],
                role: u.is_admin ? "admin" : "customer",
                status: u.is_active ? "active" : "blocked",
                avatarUrl: `https://i.pravatar.cc/150?u=${u.id}`,
                joinDate: u.created_at || new Date().toISOString(),
                lastLogin: u.last_login || new Date().toISOString(),
                totalSpent: u.total_spent,
                ordersCount: u.orders_count,
                ltvScore: u.ltv_score,
                tags: u.tags,
                phone: u.phone,
                address: u.address
            }));
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    async getUserById(id: number): Promise<AdminUser | null> {
        const token = authService.getToken();
        try {
            const res = await fetch(`${API_URL}/admin/users/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) return null;

            const u = await res.json();
            return {
                id: u.id,
                email: u.email,
                name: u.email.split("@")[0],
                role: u.is_admin ? "admin" : "customer",
                status: u.is_active ? "active" : "blocked",
                avatarUrl: `https://i.pravatar.cc/150?u=${u.id}`,
                joinDate: u.created_at || new Date().toISOString(),
                lastLogin: u.last_login || new Date().toISOString(),
                totalSpent: u.total_spent,
                ordersCount: u.orders_count,
                ltvScore: u.ltv_score,
                tags: u.tags,
                phone: u.phone,
                address: u.address
            };
        } catch (e) {
            console.error(e);
            return null;
        }
    },

    async getSecurityLogs(userId: number): Promise<SecurityLog[]> {
        return [
            { id: "1", date: new Date().toISOString(), action: "Login Success", ip: "192.168.1.1", device: "Chrome / Windows" },
            { id: "2", date: new Date(Date.now() - 86400000).toISOString(), action: "Password Change", ip: "192.168.1.1", device: "Chrome / Windows" },
            { id: "3", date: new Date(Date.now() - 172800000).toISOString(), action: "Login Failed", ip: "200.1.1.1", device: "Unknown / Linux" },
        ];
    },

    async getSupportTickets(userId: number): Promise<SupportTicket[]> {
        return [
            { id: "TK-102", date: new Date().toISOString(), subject: "Problema con despacho", status: "open" },
            { id: "TK-099", date: new Date(Date.now() - 100000000).toISOString(), subject: "Consulta de stock", status: "resolved" },
        ];
    }
};
