import Link from "next/link"
import { ShoppingCart, Menu, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center px-4">
                <div className="mr-8 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            EcoStore
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/catalog" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Catalog
                        </Link>
                        <Link href="/blog" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Blog
                        </Link>
                        <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            About
                        </Link>
                    </nav>
                </div>

                {/* Mobile Menu Button - Placeholder */}
                <Button variant="ghost" className="mr-2 md:hidden" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                </Button>
                <Link href="/" className="mr-6 flex items-center md:hidden">
                    <span className="font-bold">EcoStore</span>
                </Link>

                <div className="flex flex-1 items-center justify-end space-x-2">
                    <nav className="flex items-center space-x-2">
                        <ModeToggle />
                        <Button variant="ghost" size="icon">
                            <Link href="/cart">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="sr-only">Cart</span>
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Link href="/profile">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Profile</span>
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}
