import { useState, useEffect } from "react";
import { inventoryService, InventoryStats, StockMovement } from "@/services/inventory.service";
import { productService } from "@/services/product.service";
import { Product } from "@/models/product";

export function useInventoryViewModel() {
    const [stats, setStats] = useState<InventoryStats | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const [statsData, productsData] = await Promise.all([
                inventoryService.getDashboardStats(),
                productService.getProducts({ limit: 1000 }) // Get all for inventory list
            ]);
            setStats(statsData);
            setProducts(productsData.items);
        } catch (error) {
            console.error("Error fetching inventory dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductDetails = async (id: number) => {
        setLoading(true);
        try {
            const [productData, movementsData] = await Promise.all([
                productService.getProductById(id.toString()),
                inventoryService.getMovements(id)
            ]);
            setMovements(movementsData);
            return productData;
        } catch (error) {
            console.error("Error fetching inventory details:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const addMovement = async (productId: number, type: "IN" | "OUT" | "ADJUSTMENT", qty: number, reason: string) => {
        try {
            await inventoryService.createMovement({
                product_id: productId,
                movement_type: type,
                quantity: qty,
                reason
            });
            // Refresh
            await fetchDashboard();
            await fetchProductDetails(productId);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    // Initial load? No, let the page trigger it to avoid double loading on param pages.

    return {
        stats,
        products,
        movements,
        loading,
        fetchDashboard,
        fetchProductDetails,
        addMovement
    };
}
