import { useState, useEffect } from "react";
import { Product } from "@/models/product";
import { productService } from "@/services/product.service";

export function useProductViewModel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 12;

    useEffect(() => {
        fetchProducts({ page });
    }, [page]);

    const fetchProducts = async (params?: { search?: string, category?: string, page?: number }) => {
        try {
            setLoading(true);
            const data = await productService.getProducts({ ...params, page: params?.page || page, limit });
            setProducts(data.items);
            setTotalPages(Math.ceil(data.total / limit));
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
        page,
        totalPages,
        setPage,
        refreshProducts: (params?: { search?: string, category?: string }) => {
            setPage(1); // Reset to page 1 on new filter
            fetchProducts({ ...params, page: 1 });
        },
    };
}
