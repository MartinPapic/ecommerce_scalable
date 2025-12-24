"use client";

import Link from "next/link";
import { useRegisterViewModel } from "@/viewmodels/useRegisterViewModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
    const { formData, loading, handleChange, handleRegister } = useRegisterViewModel();

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-muted/20">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
                    <CardDescription>
                        Ingresa tus datos para registrarte
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                required
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Creando cuenta..." : "Registrarse"}
                        </Button>
                        <div className="text-center text-sm">
                            ¿Ya tienes cuenta?{" "}
                            <Link href="/login" className="underline hover:text-primary">
                                Iniciar sesión
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
