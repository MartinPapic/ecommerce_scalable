import { useState, useEffect } from "react";
import { analyticsService, DashboardStats } from "@/services/analytics.service";

export function useAnalyticsViewModel() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await analyticsService.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        stats,
        loading,
        fetchStats
    };
}
