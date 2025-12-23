export default function AdminStatsPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Estadística Descriptiva</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <h3 className="font-semibold leading-none tracking-tight">Ventas Totales</h3>
                    <p className="text-2xl font-bold mt-2">$0.00</p>
                    <p className="text-xs text-muted-foreground">+0% desde el mes pasado</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <h3 className="font-semibold leading-none tracking-tight">Usuarios Activos</h3>
                    <p className="text-2xl font-bold mt-2">0</p>
                    <p className="text-xs text-muted-foreground">+0% desde el mes pasado</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <h3 className="font-semibold leading-none tracking-tight">Productos</h3>
                    <p className="text-2xl font-bold mt-2">0</p>
                    <p className="text-xs text-muted-foreground">En inventario</p>
                </div>
            </div>

            <div className="mt-8 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                Estadísticas detalladas próximamente...
            </div>
        </div>
    );
}
