"use client";

import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { productService } from "@/services/product.service";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        productService.getCategories().then(setCategories);
    }, []);

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className={cn("cursor-pointer hover:bg-primary/90", selectedCategory === null ? "" : "hover:bg-accent")}
                onClick={() => onSelectCategory(null)}
            >
                Todas
            </Badge>
            {categories.map((cat) => (
                <Badge
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className={cn("cursor-pointer hover:bg-primary/90", selectedCategory === cat ? "" : "hover:bg-accent")}
                    onClick={() => onSelectCategory(cat)}
                >
                    {cat}
                </Badge>
            ))}
        </div>
    );
}
