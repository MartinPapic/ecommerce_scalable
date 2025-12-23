"use client";

import Image from "next/image";
import Link from "next/link";
import { useProductViewModel } from "@/viewmodels/useProductViewModel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

import { SearchBar } from "@/components/search-bar";

export default function Home() {
  const { products, loading, error, refreshProducts } = useProductViewModel();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Bienvenido a <span className="text-primary">EcoStore</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Productos sostenibles para un futuro mejor.
        </p>
        <div className="flex justify-center">
          <SearchBar onSearch={refreshProducts} />
        </div>
      </section>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Productos Destacados</h2>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 w-full bg-muted animate-pulse" />
              <CardHeader>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
          : products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group">
              <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
                <div className="relative h-48 w-full bg-secondary/20 p-8 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  {/* Placeholder image logic for demo */}
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">📦</div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                    <span className="font-bold text-lg">${product.price}</span>
                  </div>
                  <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Ver Detalles
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
