import { authService } from "./auth.service";

const API_URL = "http://localhost:8000";

export interface OrderItem {
    product_id: number;
    quantity: number;
    price: number;
    product: {
        name: string;
        image_url: string;
        category: string;
    };
}

export interface Order {
    id: number;
    total_amount: number;
    status: string;
    items: any[];
}

export const orderService = {
    async createOrder(items: OrderItem[]): Promise<Order | null> {
        const token = authService.getToken();
        if (!token) return null;

        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items }),
            });

            if (!res.ok) {
                console.error("Failed to create order");
                return null;
            }

            return await res.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async getOrders(): Promise<Order[]> {
        const token = authService.getToken();
        if (!token) return [];

        try {
            const res = await fetch(`${API_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }
};
