"use client";

import { useCatalogViewModel } from "@/viewmodels/useCatalogViewModel";
import { ProductCard } from "@/components/shop/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export default function ShopPage() {
    const {
        products, total, loading, categories,
        filters: {
            searchTerm, setSearchTerm,
            activeCategory, setActiveCategory,
            sortBy, setSortBy
        }
    } = useCatalogViewModel();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header / Search Mobile */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Catálogo</h1>
                    <p className="text-muted-foreground mt-1">Explora nuestra colección de productos premium</p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar productos..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Mobile Filters Sheet */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="md:hidden">
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Filtros</SheetTitle>
                            </SheetHeader>
                            <div className="py-6 space-y-6">
                                {/* Categories Mobile */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold">Categorías</h3>
                                    <div className="grid gap-2">
                                        {categories.map(cat => (
                                            <Button
                                                key={cat}
                                                variant={activeCategory === cat ? "default" : "ghost"}
                                                onClick={() => setActiveCategory(cat)}
                                                className="justify-start"
                                            >
                                                {cat}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Desktop Sidebar Filters */}
                <aside className="hidden md:block w-64 space-y-8 flex-shrink-0">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Categorías</h3>
                        <div className="flex flex-col gap-1">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${activeCategory === cat
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Placeholder for Price Range (Needs Slider component) */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Precio</h3>
                        {/* TODO: Implement Price Range Slider */}
                        <div className="text-sm text-muted-foreground px-3">
                            Filtrar por rango de precios (Próximamente)
                        </div>
                    </div>
                </aside>

                {/* Main Grid */}
                <main className="flex-1">
                    {/* Sort Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {products.length} de {total} resultados
                        </div>
                        <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Más Nuevos</SelectItem>
                                <SelectItem value="price_asc">Precio: Menor a Mayor</SelectItem>
                                <SelectItem value="price_desc">Precio: Mayor a Menor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Active Filters */}
                    {activeCategory !== "Todos" && (
                        <div className="flex gap-2 mb-4">
                            <Badge variant="secondary" className="pl-2 pr-1 gap-1">
                                {activeCategory}
                                <X
                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                    onClick={() => setActiveCategory("Todos")}
                                />
                            </Badge>
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-[350px] bg-muted animate-pulse rounded-lg" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground">
                            <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <h3 className="text-lg font-medium">No se encontraron productos</h3>
                            <p>Intenta cambiar los filtros o tu búsqueda.</p>
                            <Button variant="link" onClick={() => { setActiveCategory("Todos"); setSearchTerm(""); }}>
                                Limpiar filtros
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
