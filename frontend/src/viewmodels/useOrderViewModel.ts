import { useState, useCallback, useEffect } from "react";
import { orderService, Order } from "@/services/order.service";
import { toast } from "sonner";

export function useOrderViewModel() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getOrders();
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            const message = "Error al cargar las órdenes";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch on mount is handled by the consumer if needed, 
    // or we can auto-fetch here if we want strict encapsulation.
    // Given ProfilePage logic, auto-fetch on mount makes sense.
    // However, usually we might want to trigger it manually or let the consumer decide.
    // But adhering to 'ViewModel handles business logic', the data requirement belongs here.

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        loading,
        error,
        refreshOrders: fetchOrders
    };
}
