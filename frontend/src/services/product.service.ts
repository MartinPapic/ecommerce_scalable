import { Product } from "@/models/product";


const API_URL = "http://localhost:8000";

export class ProductService {
    async getProducts(): Promise<Product[]> {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) {
            throw new Error("Error fetching products");
        }
        const data = await res.json();
        // Map snake_case from python to camelCase if necessary, 
        // but we defined Pydantic schema to match closely or we need to adjust types.
        // Python sends { id, name, description, price, image_url, category }
        // Frontend expects { id, name, description, price, imageUrl, category }

        return data.map((item: any) => ({
            ...item,
            id: item.id.toString(), // Ensure ID is string for frontend
            imageUrl: item.image_url // Map snake to camel
        }));
    }

    async getProductById(id: string): Promise<Product | undefined> {
        // Placeholder for now, later implement API endpoint
        const products = await this.getProducts();
        return products.find((p) => p.id === id);
    }
}

export const productService = new ProductService();
