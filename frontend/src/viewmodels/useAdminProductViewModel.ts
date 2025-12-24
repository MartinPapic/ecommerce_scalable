import { useState, useEffect, useCallback } from "react";
import { productService } from "@/services/product.service";
import { Product } from "@/models/product";
import { toast } from "sonner";

export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
}

const INITIAL_FORM_DATA: ProductFormData = {
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: ""
};

export function useAdminProductViewModel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    // UI State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);

    // Categories
    const [categories, setCategories] = useState<string[]>([]);

    const refreshProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getProducts({ page, limit });
            setProducts(data.items);
            setTotalPages(Math.ceil(data.total / limit));
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    const fetchCategories = useCallback(async () => {
        try {
            const cats = await productService.getCategories();
            setCategories(cats);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    useEffect(() => {
        refreshProducts();
        fetchCategories();
    }, [refreshProducts, fetchCategories]);

    const deleteProduct = async (id: string) => {
        const success = await productService.deleteProduct(id);
        if (success) {
            toast.success("Producto eliminado");
            refreshProducts();
            return true;
        } else {
            toast.error("Error al eliminar");
            return false;
        }
    };

    const createProduct = async () => {
        const newProduct = {
            ...formData,
            price: parseFloat(formData.price)
        };

        const result = await productService.createProduct(newProduct);
        if (result) {
            toast.success("Producto creado");
            setIsSheetOpen(false);
            setFormData(INITIAL_FORM_DATA);
            refreshProducts();
            fetchCategories(); // Update in case of new category
            return true;
        } else {
            toast.error("Error al crear producto");
            return false;
        }
    };

    const uploadImage = async (file: File) => {
        const url = await productService.uploadImage(file);
        if (url) {
            setFormData(prev => ({ ...prev, imageUrl: url }));
            toast.success("Imagen subida exitosamente");
            return url;
        } else {
            toast.error("Error al subir imagen");
            return null;
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
    };

    return {
        // Data
        products,
        loading,
        page,
        totalPages,
        categories,
        formData,
        isSheetOpen,

        // Actions
        setPage,
        setFormData,
        setIsSheetOpen,
        deleteProduct,
        createProduct,
        uploadImage,
        resetForm,
        refreshProducts
    };
}
