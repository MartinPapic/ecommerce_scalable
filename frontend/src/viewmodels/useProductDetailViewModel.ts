import { useState, useEffect } from "react";
import { Product } from "@/models/product";
import { productService } from "@/services/product.service";

export function useProductDetailViewModel(id: string) {
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchProduct = async (productId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.getProductById(productId);
            if (!data) {
                setError("Producto no encontrado");
            } else {
                setProduct(data);
            }
        } catch (err) {
            setError("Error al cargar el producto.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        product,
        loading,
        error,
        refreshProduct: () => fetchProduct(id),
    };
}
