import { useState, useEffect } from "react";
import { inventoryService, InventoryStats, StockMovement } from "@/services/inventory.service";
import { productService } from "@/services/product.service";
import { Product } from "@/models/product";

export function useInventoryViewModel() {
    const [stats, setStats] = useState<InventoryStats>({
        total_valuation: 0,
        low_stock_count: 0,
        out_of_stock_count: 0,
        total_sku: 0
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State (Ported from AdminProductViewModel)
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: ""
    });

    const createProduct = async () => {
        const newProduct = {
            ...formData,
            price: parseFloat(formData.price),
            stockQuantity: 0,
            minStock: 5,
            costPrice: 0
        };

        const result = await productService.createProduct(newProduct);
        if (result) {
            setIsSheetOpen(false);
            setFormData({ name: "", description: "", price: "", category: "", imageUrl: "" });
            fetchDashboard(); // Refresh list
            return true;
        }
        return false;
    };

    const uploadImage = async (file: File) => {
        const url = await productService.uploadImage(file);
        if (url) {
            setFormData(prev => ({ ...prev, imageUrl: url }));
            return url;
        }
        return null;
    };

    const fetchCategories = async () => {
        const cats = await productService.getCategories();
        setCategories(cats);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

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
        addMovement,
        // Creation Actions
        createProduct,
        uploadImage,
        formData,
        setFormData,
        isSheetOpen,
        setIsSheetOpen,
        categories,
        // Bulk Import
        importIds: [] as string[],
        handleBulkImport: async (file: File) => {
            const res = await productService.bulkImport(file);
            if (res) {
                fetchDashboard();
                return res;
            }
            return null;
        }
    };
}
