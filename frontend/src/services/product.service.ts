import { Product } from "@/models/product";

// Mock data for now
const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Botella de Agua Ecológica",
        description: "Botella de acero inoxidable de 500ml, sostenible y duradera.",
        price: 25.99,
        imageUrl: "/file.svg", // Placeholder
        category: "Accesorios",
    },
    {
        id: "2",
        name: "Camiseta de Algodón Orgánico",
        description: "Camiseta básica 100% algodón orgánico.",
        price: 19.99,
        imageUrl: "/globe.svg", // Placeholder
        category: "Ropa",
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
