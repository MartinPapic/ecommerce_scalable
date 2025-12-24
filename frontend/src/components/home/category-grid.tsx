"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
    {
        id: "ropa",
        name: "Ropa Sostenible",
        description: "Moda ética y materiales orgánicos.",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2670&auto=format&fit=crop",
        href: "/catalog?category=Ropa"
    },
    {
        id: "hogar",
        name: "Hogar & Deco",
        description: "Minimalismo para tu espacio.",
        image: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=2576&auto=format&fit=crop",
        href: "/catalog?category=Hogar"
    },
    {
        id: "tecnologia",
        name: "Eco Tech",
        description: "Gadgets de bajo consumo.",
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2702&auto=format&fit=crop",
        href: "/catalog?category=Tecnologia"
    },
    {
        id: "accesorios",
        name: "Accesorios",
        description: "Detalles que marcan la diferencia.",
        image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2574&auto=format&fit=crop",
        href: "/catalog?category=Accesorios"
    }
];

export function CategoryGrid() {
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Categorías</h2>
                        <p className="text-muted-foreground mt-2">Encuentra exactamente lo que buscas.</p>
                    </div>
                    <Link href="/catalog" className="hidden md:flex items-center text-primary font-medium hover:underline">
                        Ver todas <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.href}
                            className="group relative overflow-hidden rounded-xl aspect-[4/5] bg-muted"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${category.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                                <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                                <p className="text-sm text-gray-300 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                    {category.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/catalog" className="inline-flex items-center text-primary font-medium hover:underline">
                        Ver todas <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
