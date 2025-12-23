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
import { PaginationControls } from "@/components/pagination-controls";

import { ChevronsUpDown, Check } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // 10 items per page for admin table

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: ""
    });

    // Combobox state
    const [categories, setCategories] = useState<string[]>([]);
    const [openCombobox, setOpenCombobox] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");

    const refreshProducts = async () => {
        setLoading(true);
        try {
            // Fetch with auto-pagination parameters
            const data = await productService.getProducts({ page, limit });
            setProducts(data.items);
            setTotalPages(Math.ceil(data.total / limit));
        } catch (error) {
            console.error(error);
            setProducts([]); // Fallback
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        const cats = await productService.getCategories();
        setCategories(cats);
    };

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push("/login");
            return;
        }
        refreshProducts();
        fetchCategories();
    }, [router, page]); // Refresh when page changes

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
            fetchCategories(); // Update categories if a new one was added
        } else {
            toast.error("Error al crear producto");
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
