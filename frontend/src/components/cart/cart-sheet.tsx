"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { orderService } from "@/services/order.service";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function CartSheet() {
    const { items, removeItem, updateQuantity, isOpen, setOpen } = useCartStore();
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { clearCart } = useCartStore();

    const handleCheckout = () => {
        setOpen(false);
        router.push("/checkout");
    };

    return (
        <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetContent className="flex flex-col w-full sm:max-w-md m-3 h-[calc(100vh-24px)] rounded-lg border p-1.5">
                <SheetHeader>
                    <SheetTitle>Tu Carrito ({items.length})</SheetTitle>
                    <SheetDescription>
                        Revisa tus productos antes de finalizar la compra.
                    </SheetDescription>
                </SheetHeader>

                <Separator className="my-4" />

                <ScrollArea className="flex-1 -mx-1.5 px-4.5">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium text-muted-foreground">Tu carrito está vacío</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="h-20 w-20 rounded-md bg-secondary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        <div className="text-2xl">📦</div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold line-clamp-1 text-sm">{item.name}</h4>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <p className="font-bold">${item.price}</p>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <Separator className="my-4" />

                <div className="space-y-4">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <SheetFooter>
                        <Button
                            className="w-full h-12 text-lg"
                            disabled={items.length === 0 || loading}
                            onClick={handleCheckout}
                        >
                            <CreditCard className="mr-2 h-5 w-5" />
                            {loading ? "Procesando..." : "Checkout"}
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}
