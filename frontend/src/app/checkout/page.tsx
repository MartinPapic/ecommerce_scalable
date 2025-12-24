"use client";

import { useCheckoutViewModel } from "@/viewmodels/useCheckoutViewModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
    const {
        items,
        totalAmount,
        shippingData,
        loading,
        handleShippingChange,
        placeOrder
    } = useCheckoutViewModel();

    if (items.length === 0) {
        return (
            <div className="container mx-auto py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
                <p className="text-muted-foreground">Agrega productos antes de proceder al pago.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Shipping Form */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos de Envío</CardTitle>
                            <CardDescription>Ingresa la dirección donde recibirás tu pedido</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="fullName">Nombre Completo</Label>
                                <Input
                                    id="fullName"
                                    value={shippingData.fullName}
                                    onChange={(e) => handleShippingChange("fullName", e.target.value)}
                                    placeholder="Juan Pérez"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Dirección</Label>
                                <Input
                                    id="address"
                                    value={shippingData.address}
                                    onChange={(e) => handleShippingChange("address", e.target.value)}
                                    placeholder="Av. Siempre Viva 123"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="city">Ciudad</Label>
                                    <Input
                                        id="city"
                                        value={shippingData.city}
                                        onChange={(e) => handleShippingChange("city", e.target.value)}
                                        placeholder="Santiago"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="zipCode">Código Postal</Label>
                                    <Input
                                        id="zipCode"
                                        value={shippingData.zipCode}
                                        onChange={(e) => handleShippingChange("zipCode", e.target.value)}
                                        placeholder="1234567"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="country">País</Label>
                                <Input
                                    id="country"
                                    value={shippingData.country}
                                    onChange={(e) => handleShippingChange("country", e.target.value)}
                                    placeholder="Chile"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Método de Pago</CardTitle>
                            <CardDescription>Simulación de pago seguro</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 border rounded bg-muted/20 text-sm text-muted-foreground">
                                <p>🔒 Este es un entorno de demostración. No se realizará ningún cargo real.</p>
                                <p className="mt-2 text-xs">Simularemos un pago exitoso automáticamente.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen del Pedido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start text-sm">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-muted-foreground">Cant: {item.quantity}</p>
                                        </div>
                                        <p>${item.price * item.quantity}</p>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${totalAmount}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" onClick={placeOrder} disabled={loading}>
                                {loading ? "Procesando..." : `Pagar $${totalAmount}`}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
