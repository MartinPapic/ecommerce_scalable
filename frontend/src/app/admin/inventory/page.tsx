"use client";

import { useEffect, useState } from "react";
import { useInventoryViewModel } from "@/viewmodels/useInventoryViewModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, Package, DollarSign, ArrowUpDown, Filter, Plus, Upload } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function InventoryPage() {
    const {
        stats, products, loading, fetchDashboard,
        formData, setFormData, createProduct, uploadImage, isSheetOpen, setIsSheetOpen, categories,
        handleBulkImport
    } = useInventoryViewModel();
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="p-8">Cargando inventario...</div>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Tablero de Control de Stock</h1>
                <div className="flex gap-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Agregar Nuevo SKU</SheetTitle>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Nombre del Producto</Label>
                                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Categoría</Label>
                                    <div className="relative group">
                                        <Input
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                            placeholder="Ej: Electrónica"
                                            className="w-full"
                                        />
                                        {/* Autocomplete Suggestions */}
                                        {isFocused && (
                                            <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md animate-in fade-in-0 zoom-in-95 max-h-60 overflow-auto">
                                                <div className="p-1">
                                                    {categories
                                                        .filter(c => !formData.category || c.toLowerCase().includes(formData.category.toLowerCase()))
                                                        .map((cat) => (
                                                            <div
                                                                key={cat}
                                                                className={cn(
                                                                    "cursor-pointer px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-between",
                                                                    formData.category === cat && "bg-accent text-accent-foreground"
                                                                )}
                                                                onClick={() => {
                                                                    setFormData({ ...formData, category: cat });
                                                                    setIsFocused(false);
                                                                }}
                                                            >
                                                                {cat}
                                                                {formData.category === cat && <Check className="h-4 w-4 opacity-50" />}
                                                            </div>
                                                        ))
                                                    }
                                                    {categories.length === 0 && (
                                                        <div className="px-2 py-1.5 text-sm text-muted-foreground italic">
                                                            No hay categorías guardadas
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Precio de Venta</Label>
                                    <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Descripción</Label>
                                    <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Imagen</Label>
                                    <Input type="file" onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) await uploadImage(file);
                                    }} />
                                    {formData.imageUrl && <img src={formData.imageUrl} className="h-20 w-20 object-cover rounded border" />}
                                </div>
                            </div>
                            <SheetFooter>
                                <Button onClick={createProduct}>Guardar y Crear SKU</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Upload className="mr-2 h-4 w-4" /> Importar Masivo
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Carga Masiva de Productos</DialogTitle>
                                <DialogDescription>
                                    Sube un archivo CSV con tus productos. Descarga la plantilla para ver el formato requerido.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <Button variant="secondary" className="w-full" onClick={() => {
                                    const csvContent = "data:text/csv;charset=utf-8," + "name,price,stock,min_stock,category,sku,description\nProducto Ejemplo,1000,10,2,General,SKU-001,Descripción del producto";
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", "plantilla_productos.csv");
                                    document.body.appendChild(link);
                                    link.click();
                                }}>
                                    📥 Descargar Plantilla CSV
                                </Button>

                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
                                    <Input
                                        type="file"
                                        accept=".csv"
                                        className="hidden"
                                        id="csv-upload"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                toast.promise(handleBulkImport(file), {
                                                    loading: 'Importando productos...',
                                                    success: (data: any) => `¡Éxito! ${data.created} productos creados.`,
                                                    error: 'Error al importar'
                                                });
                                            }
                                        }}
                                    />
                                    <Label htmlFor="csv-upload" className="cursor-pointer block">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <Upload className="h-8 w-8 mb-2" />
                                            <span className="font-medium">Click para seleccionar archivo</span>
                                            <span className="text-xs">o arrastra tu CSV aquí</span>
                                        </div>
                                    </Label>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valorización Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats?.total_valuation.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Costo actual del inventario</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">SKUs Activos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(stats?.total_sku || 0)}</div>
                        <p className="text-xs text-muted-foreground">Productos en catálogo</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stock Crítico</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.low_stock_count}</div>
                        <p className="text-xs text-muted-foreground">Productos bajo stock mínimo</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quiebres (Sin Stock)</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.out_of_stock_count}</div>
                        <p className="text-xs text-muted-foreground">Productos agotados</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Listado de SKUs</CardTitle>
                    <CardDescription>
                        Gestiona el stock y visualiza el estado de cada producto.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre o SKU..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">SKU</TableHead>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead className="text-right">Stock Actual</TableHead>
                                    <TableHead className="text-right">Mínimo</TableHead>
                                    <TableHead className="text-center">Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium text-muted-foreground">{product.sku || "N/A"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="h-8 w-8 rounded object-cover" />}
                                                <span className="font-medium">{product.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell className="text-right font-mono font-bold">{product.stockQuantity}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{product.minStock}</TableCell>
                                        <TableCell className="text-center">
                                            {product.stockQuantity === 0 ? (
                                                <Badge variant="destructive">Sin Stock</Badge>
                                            ) : product.stockQuantity <= product.minStock ? (
                                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Bajo</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">OK</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="ghost" asChild>
                                                <Link href={`/admin/inventory/${product.id}`}>Gestionar</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No se encontraron productos.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
