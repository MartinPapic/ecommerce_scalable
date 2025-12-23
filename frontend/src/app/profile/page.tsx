"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { orderService, Order } from "@/services/order.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, Package } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push("/login");
            return;
        }

        const fetchOrders = async () => {
            const data = await orderService.getOrders();
            setOrders(data);
            setLoading(false);
        };

        fetchOrders();
    }, [router]);

    const handleLogout = () => {
        authService.logout();
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
                            <p className="text-sm text-muted-foreground">admin@example.com</p>
                            {/* In a real app we'd fetch user details properly */}
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
                                            <ul className="text-sm space-y-1">
                                                {order.items.map((item: any, idx: number) => (
                                                    <li key={idx} className="flex justify-between">
                                                        <span>Producto #{item.product_id} (x{item.quantity})</span>
                                                        <span>${item.price}</span>
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
