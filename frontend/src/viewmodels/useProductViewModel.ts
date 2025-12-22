import { useState, useEffect } from "react";
import { Product } from "@/models/product";
import { productService } from "@/services/product.service";

export function useProductViewModel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts();
            setProducts(data);
        } catch (err) {
            setError("Error al cargar los productos.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        refreshProducts: fetchProducts,
    };
}
