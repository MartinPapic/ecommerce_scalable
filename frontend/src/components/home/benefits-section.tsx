import { Truck, RotateCcw, ShieldCheck, Mail } from "lucide-react";

export function BenefitsSection() {
    const benefits = [
        {
            icon: Truck,
            title: "Envío Gratis",
            description: "En compras sobre $50.000 a todo el país."
        },
        {
            icon: RotateCcw,
            title: "Devoluciones Simples",
            description: "30 días de garantía sin preguntas."
        },
        {
            icon: ShieldCheck,
            title: "Pago 100% Seguro",
            description: "Tus transacciones están encriptadas."
        },
        {
            icon: Mail,
            title: "Soporte 24/7",
            description: "Atención al cliente dedicada."
        }
    ];

    return (
        <section className="py-20 border-y bg-background">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {benefits.map((benefit, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-4">
                            <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                                <benefit.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function TrustSignals() {
    return (
        <section className="py-12 bg-stone-900 text-white overflow-hidden">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-medium uppercase tracking-widest opacity-70 mb-8">
                    Confían en nosotros
                </p>
                <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all">
                    {/* Placeholder Logic for Logos */}
                    {["Stripe", "PayPal", "DHL", "Visa", "Mastercard"].map((brand) => (
                        <span key={brand} className="text-2xl font-bold font-serif">{brand}</span>
                    ))}
                </div>
            </div>
        </section>
    );
}
