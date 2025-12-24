"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productService } from "@/services/product.service";
import { Product } from "@/models/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store";
import { ShoppingCart, Star, Truck, ShieldCheck, ArrowLeft, Minus, Plus, Heart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/shop/product-card";

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    const addItem = useCartStore(state => state.addItem);
    const setOpen = useCartStore(state => state.setOpen);

    useEffect(() => {
        if (id) {
            setLoading(true);
            productService.getProductById(id).then(p => {
                setProduct(p || null);
                if (p) {
                    // Fetch related (mocked by fetching all and filtering, optimization later)
                    productService.getProducts({ category: p.category, limit: 4 }).then(res => {
                        setRelatedProducts(res.items.filter(item => item.id !== p.id));
                    });
                }
                setLoading(false);
            });
        }
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        // Logic to add specific quantity? 
        // Store currently only has 'addItem(product)' which increments by 1.
        // We'll just loop for now or update store to support quantity. 
        // For MVP, just add once and user can adjust in cart, OR we loop call.
        // Let's loop call for simplicity of current store contract.
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
        toast.success(`Agregado al carrito (${quantity})`);
        setOpen(true);
    };

    if (loading) return <div className="container py-20 text-center">Cargando producto...</div>;
    if (!product) return <div className="container py-20 text-center">Producto no encontrado</div>;

    const discount = product.id === '1' ? 20 : 0; // Mock discount logic

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/shop" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al catálogo
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Gallery Section */}
                <div className="space-y-4">
                    <div className="aspect-square bg-muted rounded-xl overflow-hidden border relative">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">Sin imagen</div>
                        )}
                        {discount > 0 && (
                            <Badge className="absolute top-4 left-4 bg-red-600 text-white text-lg px-3 py-1">
                                -{discount}%
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div>
                        <Badge variant="outline" className="mb-2">{product.category}</Badge>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{product.name}</h1>
                        <div className="flex items-center mt-2 space-x-2">
                            <div className="flex text-yellow-500">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                            </div>
                            <span className="text-sm text-muted-foreground">(24 reseñas)</span>
                        </div>
                    </div>

                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
                        {discount > 0 && (
                            <span className="text-lg text-muted-foreground line-through mb-1">
                                ${(product.price * 1.2).toLocaleString()}
                            </span>
                        )}
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {product.description || "Descripción detallada del producto no disponible. Este producto es de alta calidad y cuenta con garantía de fábrica."}
                    </p>

                    <Separator />

                    {/* Actions */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border rounded-md">
                                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.stockQuantity}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {product.stockQuantity > 0 ? (
                                    <span className="text-emerald-600 font-medium whitespace-nowrap">
                                        {product.stockQuantity} disponibles
                                    </span>
                                ) : (
                                    <span className="text-red-600 font-medium">Agotado</span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button className="flex-1 h-12 text-lg" disabled={product.stockQuantity === 0} onClick={handleAddToCart}>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {product.stockQuantity === 0 ? "Sin Stock" : "Agregar al Carrito"}
                            </Button>
                            <Button variant="outline" size="icon" className="h-12 w-12">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground pt-4">
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" /> Envío gratis > $50.000
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" /> Garantía de 6 meses
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
