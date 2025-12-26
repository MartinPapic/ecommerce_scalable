import { authService } from "./auth.service";

const API_URL = "http://localhost:8000";

export interface InventoryStats {
    total_valuation: number;
    low_stock_count: number;
    out_of_stock_count: number;
    total_sku: number;
}

export interface StockMovement {
    id: number;
    product_id: number;
    quantity: number;
    movement_type: "IN" | "OUT" | "ADJUSTMENT";
    reason: string;
    created_at: string;
}

export interface CreateMovementDTO {
    product_id: number;
    quantity: number;
    movement_type: "IN" | "OUT" | "ADJUSTMENT";
    reason: string;
}

export const inventoryService = {
    async getDashboardStats(): Promise<InventoryStats> {
        const token = authService.getToken();
        const res = await fetch(`${API_URL}/inventory/dashboard`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error("Sesión expirada o sin permisos");
        }
        if (!res.ok) throw new Error("Failed to fetch inventory stats");
        return res.json();
    },

    async getMovements(productId?: number): Promise<StockMovement[]> {
        const token = authService.getToken();
        const url = productId
            ? `${API_URL}/inventory/movements?product_id=${productId}`
            : `${API_URL}/inventory/movements`;

        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return res.json();
    },

    async createMovement(data: CreateMovementDTO): Promise<StockMovement> {
        const token = authService.getToken();
        const res = await fetch(`${API_URL}/inventory/movements`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to create stock movement");
        return res.json();
    }
};
