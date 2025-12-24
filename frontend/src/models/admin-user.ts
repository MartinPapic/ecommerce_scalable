export interface AdminUser {
    id: number;
    email: string;
    name: string;
    role: "admin" | "customer";
    status: "active" | "blocked" | "pending";
    avatarUrl?: string;
    joinDate: string;
    lastLogin: string;

    // Commerce Metrics
    totalSpent: number;
    ordersCount: number;
    lastOrderDate?: string;

    // Segmentation
    tags: string[]; // e.g., "VIP", "Risk", "New"
    ltvScore: number; // 0-100

    // Contact
    phone?: string;
    address?: string;
}

export interface SecurityLog {
    id: string;
    date: string;
    action: string;
    ip: string;
    device: string;
}

export interface SupportTicket {
    id: string;
    date: string;
    subject: string;
    status: "open" | "closed" | "resolved";
}
