"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, Package, BarChart3, Home, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const items = [
        {
            title: "Usuarios",
            href: "/admin/users",
            icon: Users
        },
        {
            title: "Control Stock",
            href: "/admin/inventory",
            icon: Package
        },
        {
            title: "Business Intelligence",
            href: "/admin/stats",
            icon: BarChart3
        },
    ];

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        const user = await authService.getCurrentUser();
        if (!user || !user.is_admin) {
            toast.error("Acceso denegado. Se requieren permisos de administrador.");
            router.push("/"); // Redirect to home or login
            return;
        }
        setIsAdmin(true);
    };

    if (isAdmin === null) {
        return <div className="flex h-screen items-center justify-center">Verificando permisos...</div>;
    }

    if (isAdmin === false) {
        return null; // Should have redirected
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-muted/40 border-r p-6 flex flex-col gap-6">
                <div className="flex items-center gap-2 font-bold text-xl px-2">
                    <Link href="/admin" className="flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6" />
                        <span>Admin Panel</span>
                    </Link>
                </div>

                <nav className="grid gap-2 text-sm font-medium">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto">
                    <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Volver al Inicio
                        </Link>
                    </Button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
