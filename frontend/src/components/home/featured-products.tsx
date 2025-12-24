"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useProductViewModel } from "@/viewmodels/useProductViewModel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";

export function FeaturedProducts() {
    const { products, loading, refreshProducts } = useProductViewModel();
    const { addItem } = useCartStore();

    useEffect(() => {
        // Fetch only 4 items for featured section
        // Ideally we'd have a 'featured=true' param, but we'll just slice for now
        refreshProducts({ page: 1 });
    }, []);

    const featuredItems = products.slice(0, 4);

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        toast.success("Añadido al carrito", {
            description: `${product.name} está listo para comprar.`
        });
    };

    return (
        <section className="py-16 bg-stone-50/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Nuestros Favoritos</h2>
                    <p className="text-muted-foreground">
                        Una selección curada de nuestros productos más populares y mejor valorados por la comunidad.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="overflow-hidden border-none shadow-sm h-full">
                                <div className="h-64 w-full bg-muted animate-pulse" />
                                <CardHeader>
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-3 w-1/3" />
                                </CardHeader>
                                <CardFooter>
                                    <Skeleton className="h-10 w-full" />
                                </CardFooter>
                            </Card>
                        ))
                        : featuredItems.map((product) => (
                            <Link href={`/products/${product.id}`} key={product.id} className="group">
                                <Card className="overflow-hidden h-full flex flex-col border-none shadow-sm hover:shadow-xl transition-all duration-300">
                                    <div className="relative aspect-square w-full bg-secondary/5 p-4 flex items-center justify-center overflow-hidden">
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="object-contain w-full h-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="text-6xl group-hover:scale-110 transition-transform duration-300">📦</div>
                                        )}
                                        <Badge className="absolute top-4 right-4 bg-white text-black hover:bg-white/90 shadow-sm border-0">
                                            New
                                        </Badge>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm text-muted-foreground font-medium">{product.category}</p>
                                            <span className="font-bold">${product.price}</span>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow pt-0 pb-4">
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {product.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Button
                                            className="w-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                            onClick={(e) => handleAddToCart(e, product)}
                                        >
                                            <ShoppingCart className="mr-2 h-4 w-4" /> Agregar
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                </div>

                <div className="mt-12 text-center">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/shop">Ver Catálogo Completo</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
