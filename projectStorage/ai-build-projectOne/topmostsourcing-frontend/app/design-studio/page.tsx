"use client";

import type React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnimatedButton } from "@/components/animated-button";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/components/product-grid";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BrandRow } from "@/components/brand-row";
import { useQuery } from "@tanstack/react-query";
import { getProductsOption } from "@/services/query-options";
import { Product } from "@/types/data-types";
import { useState } from "react";

const BRAND = "#06E84E";
const INK = "#0F0F0F";

export default function DesignStudioPage() {
  const [query, setQuery] = useState("");
  const { data: products } = useQuery(getProductsOption());

  const designProducts = products?.filter(
    (p: Product) =>
      p.category?.name?.toLowerCase() === "design" &&
      p.name.toLowerCase().includes(query)
  );
  const readyProducts = products?.filter(
    (p: Product) =>
      p.category?.name?.toLowerCase() === "ready stock" &&
      p.name.toLowerCase().includes(query)
  );

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Timeless Apparel,
            <span className="relative">
              {" "}
              Modern Craftsmanship
              <span
                className="absolute -inset-x-2 bottom-1 h-2 -z-10"
                style={{ backgroundColor: `${BRAND}99` }}
              />
            </span>
          </h1>
          <p className="mt-4 text-neutral-700 max-w-2xl mx-auto">
            Explore quality-made apparel tailored to your needs. Discover
            garments crafted with care and precision.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href={"/rfq"}>
              <AnimatedButton variant="primary">
                Request a Quotation
              </AnimatedButton>
            </Link>
            <AnimatedButton variant="outline" asChild>
              <Link href="#grid">Browse Collection</Link>
            </AnimatedButton>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12">
        <BrandRow />
      </section>

      {/* Grid with tabs */}
      <section id="grid" className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Crafted for Quality, Made for You
          </h2>
          <p className="mt-2 text-sm text-neutral-700">
            Switch between concept designs and ready stock.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="max-w-xs rounded-none border-[3px]"
              style={{ borderColor: INK }}
            />
          </div>

          <Tabs defaultValue="design" className="mt-6">
            <TabsList
              className="grid grid-cols-2 w-full sm:max-w-md rounded-none p-0 border-[3px]"
              style={{ borderColor: INK }}
            >
              <TabsTrigger
                value="design"
                className="rounded-none data-[state=active]:text-black data-[state=active]:bg-[var(--brand)]"
                style={
                  {
                    // @ts-ignore CSS var for inline brand
                    "--brand": BRAND,
                    borderRight: `3px solid ${INK}`,
                  } as React.CSSProperties
                }
              >
                Design
              </TabsTrigger>
              <TabsTrigger
                value="ready"
                className="rounded-none data-[state=active]:text-black data-[state=active]:bg-[var(--brand)]"
                style={{ "--brand": BRAND } as React.CSSProperties}
              >
                Ready Stock
              </TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="mt-6">
              <ProductGrid products={designProducts} />
            </TabsContent>
            <TabsContent value="ready" className="mt-6">
              <ProductGrid products={readyProducts} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
