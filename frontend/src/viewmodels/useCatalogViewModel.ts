import { useState, useEffect, useCallback } from "react";
import { catalogService, ProductFilters } from "@/services/catalog.service";
import { Product } from "@/models/product";
import { useDebounce } from "@/lib/use-debounce"; // We might need to create this or use simple timeout

export function useCatalogViewModel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);

    // Filter State
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); // Mock max
    const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'newest'>('newest');

    // Debounce Search
    const debouncedSearch = useDebounce(searchTerm, 500);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        const filters: ProductFilters = {
            q: debouncedSearch,
            category: activeCategory === "Todos" ? undefined : activeCategory,
            sortBy
            // Not sending price yet to avoid empty results if mock data is weird, 
            // but in real app we would send minPrice/maxPrice
        };

        const data = await catalogService.getProducts(filters);
        setProducts(data.items);
        setTotal(data.total);
        setLoading(false);
    }, [debouncedSearch, activeCategory, sortBy]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        catalogService.getCategories().then(cats => setCategories(["Todos", ...cats]));
    }, []);

    return {
        products,
        total,
        loading,
        categories,
        filters: {
            searchTerm,
            setSearchTerm,
            activeCategory,
            setActiveCategory,
            sortBy,
            setSortBy,
            priceRange,
            setPriceRange
        }
    };
}
