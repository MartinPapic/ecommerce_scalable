"use client";

import { useEffect, useState } from "react";
import { useAdminUserViewModel } from "@/viewmodels/useAdminUserViewModel";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, CreditCard, ShoppingBag, Clock, MapPin, Mail, Phone, Home, Ticket } from "lucide-react";

export default function UserDetailPage() {
    const params = useParams();
    const id = parseInt(params.id as string);
    const { selectedUser: user, securityLogs, tickets, loading, fetchUserDetails } = useAdminUserViewModel();

    useEffect(() => {
        if (id) fetchUserDetails(id);
    }, [id]);

    if (loading || !user) {
        return <div className="p-8 text-center">Cargando perfil...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header / Ficha Resumen */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-primary">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            {user.name}
                            <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                        </h1>
                        <div className="flex items-center gap-4 text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {user.email}</span>
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Unido {new Date(user.joinDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Reset Password</Button>
                    <Button variant="destructive">Bloquear</Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="overview">Visión 360°</TabsTrigger>
                    <TabsTrigger value="history">Compras</TabsTrigger>
                    <TabsTrigger value="security">Seguridad</TabsTrigger>
                    <TabsTrigger value="support">Soporte</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Customer Intelligence</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">LTV Score</p>
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold">{user.ltvScore}/100</div>
                                        {user.ltvScore > 70 && <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">High Value</Badge>}
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Segmentación (Tags)</p>
                                    <div className="flex flex-wrap gap-2">
                                        {user.tags.map(tag => (
                                            <Badge key={tag} variant="outline">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Datos de Contacto</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.phone || "No registrado"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.address || "No registrado"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Home className="h-4 w-4 text-muted-foreground" />
                                    <span>Región Metropolitana, Chile</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Resumen Financiero</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Gastado</span>
                                    <span className="font-bold text-lg">${user.totalSpent.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Órdenes Totales</span>
                                    <span className="font-bold">{user.ordersCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Ticket Promedio</span>
                                    <span className="font-bold">
                                        ${user.ordersCount > 0 ? Math.round(user.totalSpent / user.ordersCount).toLocaleString() : 0}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Preferencias y Consentimiento</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Newsletter</span>
                                    <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">Aceptado</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Términos y Condiciones</span>
                                    <span className="text-xs">{new Date(user.joinDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Uso de Datos</span>
                                    <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">Aceptado</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* PURCHASE HISTORY TAB */}
                <TabsContent value="history" className="pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Pedidos</CardTitle>
                            <CardDescription>Últimas transacciones del usuario.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {[1, 2, 3].map((order) => (
                                    <div key={order} className="flex items-center">
                                        <div className="bg-primary/10 p-2 rounded-full mr-4">
                                            <ShoppingBag className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                Orden #{1000 + order}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date().toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="font-medium mr-4">${(Math.random() * 50000).toFixed(0)}</div>
                                        <Badge variant="outline">Entregado</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SECURITY TAB */}
                <TabsContent value="security" className="pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Logs de Seguridad y Acceso</CardTitle>
                            <CardDescription>Auditoría de acciones sensibles.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {securityLogs.map(log => (
                                    <div key={log.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                        <div className="flex items-start gap-3">
                                            <Shield className="h-4 w-4 mt-1 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">{log.action}</p>
                                                <p className="text-xs text-muted-foreground">{log.device} • {log.ip}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(log.date).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SUPPORT TAB */}
                <TabsContent value="support" className="pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Soporte</CardTitle>
                            <CardDescription>Tickets y consultas realizadas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {tickets.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No hay tickets registrados.</p>
                                ) : tickets.map(ticket => (
                                    <div key={ticket.id} className="flex justify-between items-center border p-3 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Ticket className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-sm">{ticket.subject}</p>
                                                <p className="text-xs text-gray-400">ID: {ticket.id}</p>
                                            </div>
                                        </div>
                                        <Badge variant={ticket.status === "open" ? "default" : "secondary"}>
                                            {ticket.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
