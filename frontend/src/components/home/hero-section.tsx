"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    return (
        <section className="relative w-full bg-stone-900 text-white overflow-hidden">
            {/* Background Image Placeholder or Abstract Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
            <div
                className="absolute inset-0 bg-cover bg-center z-0 opacity-60"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?q=80&w=2626&auto=format&fit=crop")' }}
            />

            <div className="container relative z-20 mx-auto px-4 py-24 md:py-32 lg:py-40 flex flex-col justify-center h-full">
                <div className="max-w-2xl space-y-6">
                    <div className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary-foreground backdrop-blur-sm border border-primary/30">
                        Nueva Colección 2025
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                        Sostenibilidad <br /> con Estilo.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-lg">
                        Descubre productos diseñados para durar, creados con materiales responsables y pensados para tu vida diaria.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" className="text-base px-8 py-6 h-auto" asChild>
                            <Link href="/shop?category=all">Explorar Tienda</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-base px-8 py-6 h-auto bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors" asChild>
                            <Link href="/about">Nuestra Misión</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
