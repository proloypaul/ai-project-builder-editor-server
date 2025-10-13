import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedButton } from "@/components/animated-button";
import { Separator } from "@/components/ui/separator";
import { ProductGrid } from "@/components/product-grid";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { serverUrl } from "@/config/app-config";
import { getProduct, getProducts } from "@/services/api";
import ProductDescription from "@/components/product-description";
import { Product } from "@/types/data-types";

const BRAND = "#06E84E";
const INK = "#0F0F0F";

type Params = {
  params: { id: string };
};

export default async function ProductDetailPage({ params }: Params) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return notFound();

  const moreProducts = await getProducts(
    `category=${product?.category}&page=1&limit=5`
  );

  const filteredProducts = moreProducts.filter(
    (p: Product) => p._id !== product?._id
  );

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      <section className="px-4 md:px-8 lg:px-12 py-10 md:py-14">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Product Details
          </h1>

          <div className="mt-8 grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <div
                className="rounded-none border-[3px] overflow-hidden"
                style={{ borderColor: INK, boxShadow: `8px 8px 0 0 ${INK}` }}
              >
                <Image
                  src={
                    `${serverUrl}/${product?.imageUrl}` ||
                    "/placeholder.svg?height=900&width=900"
                  }
                  alt={"product"}
                  width={900}
                  height={900}
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="mt-3 flex gap-3 overflow-auto">
                {product?.secondaryImages?.map((src: string, i: number) => (
                  <Image
                    key={i}
                    src={
                      `${serverUrl}/${src}` ||
                      "/placeholder.svg?height=200&width=200"
                    }
                    alt={`${product?.name} thumbnail ${i + 1}`}
                    width={140}
                    height={140}
                    className="rounded-none border-[3px] object-cover w-24 h-24 md:w-28 md:h-28"
                    style={{ borderColor: INK }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {product?.name}
              </h2>
              <div className="mt-4 grid gap-2 text-sm">
                <p>
                  <span className="font-semibold">Price:</span> Negotiable
                </p>
                <p>
                  <span className="font-semibold">Size:</span> {product?.sizes}
                </p>
                <p>
                  <span className="font-semibold">Color:</span>{" "}
                  {product?.colors}
                </p>
                {"quantity" in product && (
                  <p>
                    <span className="font-semibold">Quantity:</span>{" "}
                    {product?.quantity}
                  </p>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <AnimatedButton variant="primary">
                  Request a Quotation
                </AnimatedButton>
                <AnimatedButton variant="outline" asChild>
                  <a
                    href="https://wa.me/+8801912563709"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </AnimatedButton>
              </div>

              <Separator className="my-8" />

              <div>
                <h3 className="text-xl font-black" style={{ color: BRAND }}>
                  Product Description
                </h3>
                <ProductDescription desc={product?.description} />
                {/* <ul className="mt-4 list-disc pl-6 text-sm text-neutral-700 space-y-1">
                  <li>Fabric weight: 180 GSM</li>
                  <li>Regular fit with comfortable stretch</li>
                  <li>Moisture-wicking properties</li>
                  <li>Pre-shrunk; maintains structure over time</li>
                </ul> */}
              </div>
            </div>
          </div>

          <Separator className="my-10" />

          <h3 className="text-2xl font-bold">More Products for you!</h3>
          <div className="mt-6">
            <ProductGrid products={filteredProducts?.slice(0, 8)} />
          </div>

          <div className="mt-8">
            <AnimatedButton variant="outline" asChild>
              <Link href="/design-studio">Back to Design Studio</Link>
            </AnimatedButton>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
