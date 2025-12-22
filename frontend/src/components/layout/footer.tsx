import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Desarrollado por <span className="font-medium underline underline-offset-4">Martin Papic</span>.
                        El código fuente está disponible en <span className="font-medium underline underline-offset-4">GitHub</span>.
                    </p>
                </div>
                <nav className="flex items-center space-x-4 text-sm font-medium text-muted-foreground">
                    <Link href="/terms" className="transition-colors hover:text-foreground">
                        Términos
                    </Link>
                    <Link href="/privacy" className="transition-colors hover:text-foreground">
                        Privacidad
                    </Link>
                </nav>
            </div>
        </footer>
    )
}
