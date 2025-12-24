"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useOrderViewModel } from "@/viewmodels/useOrderViewModel";
import { Order } from "@/services/order.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, Package } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
    const router = useRouter();
    const { isAuthenticated, logout, user } = useAuthStore();
    const { orders, loading } = useOrderViewModel();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        toast.info("Has cerrado sesión.");
        router.push("/");
    };

    if (loading) {
        return <div className="p-8 text-center">Cargando perfil...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Mi Perfil</h1>
                <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Datos de Cuenta</CardTitle>
                        <CardDescription>Información personal</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm font-medium leading-none">Email</p>
                            <p className="text-sm text-muted-foreground">{user?.email || "No disponible"}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Historial de Órdenes</CardTitle>
                        <CardDescription>Tus compras recientes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orders.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No tienes órdenes registradas.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    <Package className="h-5 w-5" />
                                                    Orden #{order.id}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    ID: {order.id}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Badge className="mb-1">{order.status}</Badge>
                                                <p className="font-bold text-lg">${order.total_amount}</p>
                                            </div>
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold">Items:</p>
                                            <ul className="space-y-3 mt-2">
                                                {order.items.map((item: any, idx: number) => (
                                                    <li key={idx} className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded bg-muted overflow-hidden relative border shrink-0">
                                                            {item.product && item.product.image_url ? (
                                                                <img
                                                                    src={item.product.image_url}
                                                                    alt={item.product.name}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full text-xs bg-gray-100 text-gray-400">IMG</div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">{item.product?.name || `Producto #${item.product_id}`}</p>
                                                            <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-medium text-sm whitespace-nowrap">${item.price}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
