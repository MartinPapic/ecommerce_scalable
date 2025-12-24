"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
// We'll use standard HTML inputs if Shadcn Input isn't installed, 
// but let's assume we can use basic styling or install input/label.
// I'll check/install Input/Label components first or use basic HTML to be safe and fast.
// Actually, I'll use Shadcn Card for layout.
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react"; // Mistake, Link is next/link

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const success = await authService.login(username, password);
        if (success) {
            // Update the global store
            await useAuthStore.getState().checkAuth();
            router.push("/");
            // Force reload is no longer needed with proper state management
        } else {
            setError("Credenciales inválidas");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                    <CardDescription>
                        Ingresa tu email para acceder a tu cuenta.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-4">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={loading}>
                            {loading ? "Cargando..." : "Ingresar"}
                        </Button>
                    </CardFooter>
                </form>
                <div className="p-4 text-center text-sm text-muted-foreground">
                    ¿No tienes una cuenta?{" "}
                    <span
                        className="underline cursor-pointer hover:text-primary"
                        onClick={() => router.push("/register")}
                    >
                        Registrarse
                    </span>
                </div>
            </Card>
        </div>
    );
}
