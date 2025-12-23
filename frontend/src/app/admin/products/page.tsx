"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { productService } from "@/services/product.service";
import { Product } from "@/models/product";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: ""
    });

    const refreshProducts = async () => {
        const data = await productService.getProducts();
        setProducts(data);
    };

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push("/login");
            return;
        }
        // In a real app we would check isAdmin here too or API would reject

        refreshProducts().then(() => setLoading(false));
    }, [router]);

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            const success = await productService.deleteProduct(id);
            if (success) {
                toast.success("Producto eliminado");
                refreshProducts();
            } else {
                toast.error("Error al eliminar");
            }
        }
    };

    const handleCreate = async () => {
        const newProduct = {
            ...formData,
            price: parseFloat(formData.price)
        };

        const result = await productService.createProduct(newProduct);
        if (result) {
            toast.success("Producto creado");
            setIsSheetOpen(false);
            setFormData({ name: "", description: "", price: "", category: "", imageUrl: "" });
            refreshProducts();
        } else {
            toast.error("Error al crear producto");
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando panel...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.push("/")} className="mb-4 pl-0">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
                </Button>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Gestión de Productos</h1>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Agregar Producto</SheetTitle>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Nombre</Label>
                                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Descripción</Label>
                                    <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Precio</Label>
                                    <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Categoría</Label>
                                    <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>URL Imagen</Label>
                                    <Input value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                                </div>
                            </div>
                            <SheetFooter>
                                <Button onClick={handleCreate}>Guardar</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
