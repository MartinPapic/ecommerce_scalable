export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    sku?: string;
    stockQuantity: number;
    minStock: number;
    costPrice: number;
    supplier?: string;
}
