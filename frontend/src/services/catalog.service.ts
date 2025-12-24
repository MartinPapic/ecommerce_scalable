import { Product } from "@/models/product";

export interface ProductFilters {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: 'price_asc' | 'price_desc' | 'newest';
}

export interface ProductsResponse {
    items: Product[];
    total: number;
}

const API_URL = "http://localhost:8000";

export const catalogService = {
    async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
        const params = new URLSearchParams();
        if (filters.q) params.append('q', filters.q);
        if (filters.category && filters.category !== "Todos") params.append('category', filters.category);
        if (filters.minPrice) params.append('min_price', filters.minPrice.toString());
        if (filters.maxPrice) params.append('max_price', filters.maxPrice.toString());
        if (filters.inStock) params.append('in_stock', 'true');
        if (filters.sortBy) params.append('sort_by', filters.sortBy);

        try {
            const res = await fetch(`${API_URL}/products?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch products");
            return await res.json();
        } catch (error) {
            console.error("Catalog fetch error:", error);
            return { items: [], total: 0 };
        }
    },

    async getCategories(): Promise<string[]> {
        try {
            const res = await fetch(`${API_URL}/categories`);
            if (!res.ok) throw new Error("Failed to fetch categories");
            return await res.json();
        } catch (error) {
            return [];
        }
    }
};
