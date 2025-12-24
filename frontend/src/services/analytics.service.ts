export interface DailySales {
    date: string;
    revenue: number;
    orders: number;
}

export interface CategorySales {
    name: string;
    value: number;
}

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    conversionRate: number;
    avgTicket: number;
    salesTrend: DailySales[];
    categoryDistribution: CategorySales[];
}

export const analyticsService = {
    async getDashboardStats(): Promise<DashboardStats | null> {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const res = await fetch("http://localhost:8000/analytics/dashboard", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Failed to fetch analytics");

            return await res.json();
        } catch (error) {
            console.error("Analytics fetch error:", error);
            return null;
        }
    }
};
