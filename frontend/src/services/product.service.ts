import { Product } from "@/models/product";

// Mock data for now
const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Eco-Friendly Water Bottle",
        description: "Sustainable 500ml stainless steel water bottle.",
        price: 25.99,
        imageUrl: "/file.svg", // Placeholder
        category: "Accessories",
    },
    {
        id: "2",
        name: "Organic Cotton T-Shirt",
        description: "100% organic cotton basic t-shirt.",
        price: 19.99,
        imageUrl: "/globe.svg", // Placeholder
        category: "Clothing",
    },
];

export class ProductService {
    async getProducts(): Promise<Product[]> {
        // Simulate network latency
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_PRODUCTS);
            }, 1000);
        });
    }

    async getProductById(id: string): Promise<Product | undefined> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_PRODUCTS.find((p) => p.id === id));
            }, 500);
        });
    }
}

export const productService = new ProductService();
