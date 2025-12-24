"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useInventoryViewModel } from "@/viewmodels/useInventoryViewModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowDown, ArrowUp, RefreshCcw, AlertTriangle, Package } from "lucide-react";
import { Product } from "@/models/product";
import Link from "next/link";
import { toast } from "sonner"; // Assuming sonner is installed or uses similar toast

export default function InventoryDetailPage() {
    const params = useParams();
    const id = parseInt(params.id as string);
    const { fetchProductDetails, movements, addMovement } = useInventoryViewModel();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    // Action State
    const [actionType, setActionType] = useState<"IN" | "OUT" | "ADJUSTMENT">("IN");
    const [qty, setQty] = useState(1);
    const [reason, setReason] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        const p = await fetchProductDetails(id);
        // Cast to any because the service returns the interface but we updated it
        setProduct(p as unknown as Product);
        setLoading(false);
    };

    useEffect(() => {
        if (id) loadData();
    }, [id]);

    const handleAction = async () => {
        if (!product) return;
        const success = await addMovement(parseInt(product.id), actionType, qty, reason);
        if (success) {
            setIsDialogOpen(false);
            setQty(1);
            setReason("");
            loadData(); // Reload to see new stock
        }
    };

    if (loading || !product) return <div className="p-8">Cargando...</div>;

    const getActionColor = (type: string) => {
        switch (type) {
            case "IN": return "text-emerald-600 bg-emerald-50";
            case "OUT": return "text-red-600 bg-red-50";
            default: return "text-blue-600 bg-blue-50";
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="h-8 w-8 p-0" asChild>
                    <Link href="/admin/inventory"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Control de Inventario: {product.name}</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Product Status Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estado Actual</CardTitle>
                        <CardDescription>Resumen de existencias y configuración.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Stock Físico</p>
                                <p className="text-4xl font-bold font-mono">{product.stockQuantity}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                                {product.stockQuantity === 0 ? (
                                    <Badge variant="destructive" className="text-lg px-4 py-1">Agotado</Badge>
                                ) : product.stockQuantity <= product.minStock ? (
                                    <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-1">Crítico</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-lg px-4 py-1">Normal</Badge>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-xs text-muted-foreground">Punto de Reposición (Min)</p>
                                <p className="font-semibold">{product.minStock} un.</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">SKU</p>
                                <p className="font-mono text-sm">{product.sku || "Sin asignar"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Costo Unitario</p>
                                <p className="font-semibold">${product.costPrice?.toLocaleString() || 0}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Valor Total</p>
                                <p className="font-semibold">${(product.stockQuantity * (product.costPrice || 0)).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => { setActionType("IN"); setIsDialogOpen(true); }}>
                                <ArrowDown className="mr-2 h-4 w-4" /> Entrada
                            </Button>
                            <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => { setActionType("OUT"); setIsDialogOpen(true); }}>
                                <ArrowUp className="mr-2 h-4 w-4" /> Salida
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => { setActionType("ADJUSTMENT"); setIsDialogOpen(true); }}>
                                <RefreshCcw className="mr-2 h-4 w-4" /> Ajuste
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Alert / Supplier Card (Placeholder for now) */}
                <Card className="flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle>Proveedores y Reposición</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20">
                            <Package className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="font-medium">Proveedor Principal</p>
                                <p className="text-sm text-muted-foreground">{product.supplier || "No configurado"}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="ml-auto">Editar</Button>
                        </div>
                        {product.stockQuantity <= product.minStock && (
                            <div className="mt-4 p-4 border border-yellow-200 bg-yellow-50 rounded-lg flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-yellow-900">Alerta de Stock Bajo</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        El stock actual está por debajo del mínimo ({product.minStock}). Se recomienda generar una orden de compra.
                                    </p>
                                    <Button size="sm" variant="outline" className="mt-2 border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                                        Generar Orden
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* KARDEX TABLE */}
            <Card>
                <CardHeader>
                    <CardTitle>Kardex (Movimientos)</CardTitle>
                    <CardDescription>Historial detallado de todas las transacciones.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Motivo</TableHead>
                                <TableHead className="text-right">Cantidad</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {movements.map((mov) => (
                                <TableRow key={mov.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {new Date(mov.created_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getActionColor(mov.movement_type)}>
                                            {mov.movement_type === "IN" ? "ENTRADA" : mov.movement_type === "OUT" ? "SALIDA" : "AJUSTE"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{mov.reason || "-"}</TableCell>
                                    <TableCell className="text-right font-bold">
                                        {mov.movement_type === "OUT" ? "-" : "+"}{mov.quantity}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {movements.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        No hay movimientos registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Action Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === "IN" ? "Registrar Entrada" : actionType === "OUT" ? "Registrar Salida" : "Ajuste de Inventario"}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === "IN" && "Aumenta el stock (Compra, Devolución)."}
                            {actionType === "OUT" && "Disminuye el stock (Merma, Uso interno)."}
                            {actionType === "ADJUSTMENT" && "Corrige el stock (Inventario físico)."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="qty" className="text-right">Cantidad</Label>
                            <Input id="qty" type="number" value={qty} onChange={(e) => setQty(parseInt(e.target.value))} className="col-span-3" min="1" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reason" className="text-right">Motivo</Label>
                            <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="col-span-3" placeholder="Ej: Compra proveedor #123" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAction}>Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
