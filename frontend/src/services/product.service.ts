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
                imageUrl: item.image_url
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
                imageUrl: item.image_url
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
}

export const productService = new ProductService();
