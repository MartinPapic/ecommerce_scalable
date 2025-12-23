"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProductDetailViewModel } from "@/viewmodels/useProductDetailViewModel";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ShoppingCart, Truck, ShieldCheck } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap the params Promise (Next.js 15+ convention for server/async components, 
    // but useful in client components if passed down or handling params safely)
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        params.then((resolvedParams) => setId(resolvedParams.id));
    }, [params]);

    const { product, loading, error } = useProductDetailViewModel(id || "");

    if (!id) return null; // Wait for params

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
                <p className="text-muted-foreground mb-8">{error}</p>
                <Link href="/">
                    <Button variant="outline">Volver al inicio</Button>
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-2 items-center text-muted-foreground mb-8">
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <Skeleton className="w-full aspect-square rounded-xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-12 w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb / Back Navigation */}
            <div className="mb-8">
                <Link href="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors w-fit">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Volver al catálogo
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Product Image */}
                <div className="bg-secondary/20 rounded-xl p-12 flex items-center justify-center aspect-square relative overflow-hidden">
                    {/* Placeholder logic until real images are used */}
                    <div className="text-9xl">📦</div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <Badge variant="secondary" className="mb-2 text-md px-3 py-1">
                            {product.category}
                        </Badge>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
                            {product.name}
                        </h1>
                    </div>

                    <p className="text-3xl font-bold text-primary">
                        ${product.price}
                    </p>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>

                    <div className="h-px bg-border my-8" />

                    <div className="flex flex-col gap-4">
                        <Button
                            size="lg"
                            className="w-full md:w-auto text-lg h-12 px-8"
                            onClick={() => useCartStore.getState().addItem(product)}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Agregar al Carrito
                        </Button>
                        <p className="text-xs text-muted-foreground text-center md:text-left">
                            Envío calculado al finalizar la compra.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-card/50">
                            <Truck className="h-6 w-6 text-primary" />
                            <span className="font-semibold text-sm">Envío Rápido</span>
                            <span className="text-xs text-muted-foreground">Despacho en 24-48 horas.</span>
                        </div>
                        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-card/50">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                            <span className="font-semibold text-sm">Garantía Eco</span>
                            <span className="text-xs text-muted-foreground">Devolución gratuita por 30 días.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
