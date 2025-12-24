"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setEmail("");
            toast.success("¡Gracias por suscribirte!", {
                description: "Revisa tu bandeja de entrada para tu cupón de bienvenida."
            });
        }, 1500);
    };

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="bg-stone-100 rounded-3xl p-8 md:p-16 text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                            <Mail className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Únete a la comunidad
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Recibe noticias sobre lanzamientos, tips de sostenibilidad y un <span className="font-semibold text-foreground">10% de descuento</span> en tu primera compra.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                            <Input
                                type="email"
                                placeholder="tu@email.com"
                                className="h-12 bg-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button type="submit" size="lg" className="h-12 px-8" disabled={loading}>
                                {loading ? "Enviando..." : "Suscribirse"}
                            </Button>
                        </form>

                        <p className="text-xs text-muted-foreground pt-2">
                            No enviamos spam. Puedes darte de baja en cualquier momento.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
