"use client";

import { Product } from "@/models/product";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore(state => state.addItem);
    const setOpen = useCartStore(state => state.setOpen);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if inside Link
        addItem(product);
        toast.success("Producto agregado al carrito");
        setOpen(true);
    };

    const isOutOfStock = product.stockQuantity === 0;

    return (
        <div className="group relative">
            <Link href={`/shop/${product.id}`}>
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden bg-muted/20">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                Sin imagen
                            </div>
                        )}

                        {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                <span className="text-white font-bold text-lg uppercase tracking-widest">Agotado</span>
                            </div>
                        )}

                        {!isOutOfStock && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-gradient-to-t from-black/80 to-transparent">
                                <Button
                                    className="w-full bg-white text-black hover:bg-gray-200"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" /> Agregar al Carrito
                                </Button>
                            </div>
                        )}
                    </div>

                    <CardContent className="p-4">
                        <div className="mb-2 flex items-start justify-between">
                            <Badge variant="outline" className="text-xs font-normal">
                                {product.category}
                            </Badge>
                            {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                                <span className="text-xs text-orange-600 font-medium">
                                    ¡Últimas {product.stockQuantity}!
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold leading-tight line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                        </h3>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                        <div className="text-lg font-bold">
                            ${product.price.toLocaleString()}
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </div>
    );
}
