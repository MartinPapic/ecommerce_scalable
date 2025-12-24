import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CampaignBanner() {
    return (
        <section className="relative w-full py-24 bg-primary overflow-hidden">
            {/* Decorative Background Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="container relative z-10 mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto space-y-6 text-primary-foreground">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                        Venta de Fin de Temporada
                    </h2>
                    <p className="text-xl opacity-90">
                        Hasta 50% de descuento en productos seleccionados. Renueva tu hogar con estilo sostenible.
                    </p>
                    <div className="pt-4">
                        <Button size="lg" variant="secondary" className="text-primary font-bold px-8" asChild>
                            <Link href="/shop?discount=true">
                                Ver Ofertas
                            </Link>
                        </Button>
                    </div>
                    <p className="text-sm opacity-70 mt-4">
                        *Oferta válida hasta agotar stock.
                    </p>
                </div>
            </div>
        </section>
    );
}
