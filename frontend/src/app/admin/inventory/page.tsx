"use client";

import { useEffect, useState } from "react";
import { useInventoryViewModel } from "@/viewmodels/useInventoryViewModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, Package, DollarSign, ArrowUpDown, Filter } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
    const { stats, products, loading, fetchDashboard } = useInventoryViewModel();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading && !stats) return <div className="p-8">Cargando inventario...</div>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Inventario</h1>
                <div className="flex gap-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtros</Button>
                    <Button>Importar Masivo</Button>
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
