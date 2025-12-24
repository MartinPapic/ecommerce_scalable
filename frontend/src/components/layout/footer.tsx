import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full bg-stone-950 text-stone-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white mb-4">EcoStore</h3>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Comprometidos con el futuro del planeta. Ofrecemos productos sostenibles, éticos y de alta calidad para un estilo de vida consciente.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Tienda</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/catalog?category=new" className="hover:text-white transition-colors">Novedades</Link></li>
                            <li><Link href="/catalog?category=best-sellers" className="hover:text-white transition-colors">Más Vendidos</Link></li>
                            <li><Link href="/catalog" className="hover:text-white transition-colors">Catálogo Completo</Link></li>
                            <li><Link href="/catalog?category=offers" className="hover:text-white transition-colors">Ofertas</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Ayuda</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Envíos y Devoluciones</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
                            <li><Link href="/track" className="hover:text-white transition-colors">Seguir mi pedido</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/terms" className="hover:text-white transition-colors">Términos de Servicio</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
                            <li><Link href="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
                    <p>
                        © 2025 EcoStore Inc. Todos los derechos reservados.
                    </p>
                    <p>
                        Desarrollado con ❤️ para un mundo mejor.
                    </p>
                </div>
            </div>
        </footer>
    )
}
