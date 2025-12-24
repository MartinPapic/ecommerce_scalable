"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAdminProductViewModel } from "@/viewmodels/useAdminProductViewModel";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { PaginationControls } from "@/components/pagination-controls";
import { ChevronsUpDown, Check } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
    const router = useRouter();

    // ViewModel
    const {
        products,
        loading,
        page,
        totalPages,
        categories,
        formData,
        isSheetOpen,
        setPage,
        setFormData,
        setIsSheetOpen,
        deleteProduct,
        createProduct,
        uploadImage
    } = useAdminProductViewModel();

    // Local UI State (Combobox)
    const [openCombobox, setOpenCombobox] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");

    // Auth Check
    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push("/login");
        }
    }, [router]);

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            await deleteProduct(id);
        }
    };

    if (loading && products.length === 0) return <div className="p-8 text-center">Cargando panel...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
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
                            <div className="grid gap-4 py-4 p-3">
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
                                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openCombobox}
                                                className="w-full justify-between"
                                            >
                                                {formData.category
                                                    ? formData.category
                                                    : "Seleccionar categoría..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar categoría..." onValueChange={setCategorySearch} />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full justify-start font-normal"
                                                            onClick={() => {
                                                                setFormData({ ...formData, category: categorySearch });
                                                                setOpenCombobox(false);
                                                            }}
                                                        >
                                                            Usar "{categorySearch}"
                                                        </Button>
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {categories.map((category) => (
                                                            <CommandItem
                                                                key={category}
                                                                value={category}
                                                                onSelect={(currentValue) => {
                                                                    setFormData({ ...formData, category: currentValue });
                                                                    setOpenCombobox(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        formData.category === category ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {category}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Imagen del Producto</Label>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    await uploadImage(file);
                                                }
                                            }}
                                        />
                                    </div>
                                    {formData.imageUrl && (
                                        <div className="mt-2">
                                            <p className="text-xs text-muted-foreground mb-1">Vista previa:</p>
                                            <img src={formData.imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-md border" />
                                            <Input
                                                value={formData.imageUrl}
                                                readOnly
                                                className="mt-2 text-xs text-muted-foreground bg-muted"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <SheetFooter>
                                <Button onClick={createProduct}>Guardar</Button>
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

            <div className="mt-4 flex justify-end">
                <PaginationControls
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}
