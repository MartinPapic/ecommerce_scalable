import { Product } from "@/models/product";


const API_URL = "http://localhost:8000";

export class ProductService {
    async getProducts(params?: { search?: string, category?: string, page?: number, limit?: number }): Promise<{ items: Product[], total: number }> {
        const url = new URL(`${API_URL}/products`);
        if (params?.search) url.searchParams.append('q', params.search);
        if (params?.category) url.searchParams.append('category', params.category);

        const page = params?.page || 1;
        const limit = params?.limit || 12;
        const skip = (page - 1) * limit;

        url.searchParams.append('skip', skip.toString());
        url.searchParams.append('limit', limit.toString());

        const res = await fetch(url.toString());
        if (!res.ok) {
            throw new Error("Error fetching products");
        }
        const data = await res.json();

        return {
            items: data.items.map((item: any) => ({
                ...item,
                id: item.id.toString(),
                imageUrl: item.image_url,
                stockQuantity: item.stock_quantity,
                minStock: item.min_stock,
                costPrice: item.cost_price
            })),
            total: data.total
        };
    }

    async getProductById(id: string): Promise<Product | undefined> {
        try {
            const res = await fetch(`${API_URL}/products/${id}`);
            if (!res.ok) {
                if (res.status === 404) return undefined;
                throw new Error("Error fetching product");
            }
            const item = await res.json();
            return {
                ...item,
                id: item.id.toString(),
                imageUrl: item.image_url,
                stockQuantity: item.stock_quantity,
                minStock: item.min_stock,
                costPrice: item.cost_price
            };
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    async getCategories(): Promise<string[]> {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) return [];
        return await res.json();
    }

    async createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image_url: product.imageUrl,
                    category: product.category
                })
            });
            if (!res.ok) return null;
            return await res.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteProduct(id: string): Promise<boolean> {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return res.ok;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async uploadImage(file: File): Promise<string | null> {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_URL}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();
            return data.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    }

    async bulkImport(file: File): Promise<{ created: number, errors: string[] } | null> {
        const formData = new FormData();
        formData.append("file", file);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_URL}/products/bulk`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            if (!res.ok) throw new Error("Import failed");
            return await res.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

export const productService = new ProductService();
