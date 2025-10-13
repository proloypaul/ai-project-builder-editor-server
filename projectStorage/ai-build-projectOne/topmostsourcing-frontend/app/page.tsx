"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MessageCircle,
  BadgeCheck,
  Leaf,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { products } from "@/lib/data";
import { ProductGrid } from "@/components/product-grid";
import { BrandRow } from "@/components/brand-row";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MarqueeStrip } from "@/components/marquee-strip";
import { SectionTitle } from "@/components/section-title";
import { AboutSection } from "@/components/about-section";
import { Testimonials } from "@/components/testimonials";
import { AnimatedButton } from "@/components/animated-button";
import { FloatingElements } from "@/components/floating-elements";
import { getProductsOption } from "@/services/query-options";
import { useMutation, useQuery } from "@tanstack/react-query";
import ProductSlideShow from "@/components/product-slide-show";
import { useState } from "react";
import { MailData } from "@/types/data-types";
import { sendMail } from "@/services/api";
import { toast } from "sonner";

const BRAND = "#06E84E";
const INK = "#0F0F0F";

export default function Page() {
  const [mailData, setMailData] = useState<MailData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    mailText: "",
  });
  const { data: products } = useQuery(getProductsOption());
  const { mutate } = useMutation({
    mutationFn: sendMail,
    onSuccess: () => {
      toast.success("Your message has been sent successfully");
      setMailData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        mailText: "",
      });
    },
  });

  return (
    <main className="min-h-screen bg-white text-black relative">
      <FloatingElements />
      <SiteHeader />

      {/* Hero - Brutalist split with bold headline */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-[-0.02em]">
              Timeless Apparel,
              <span className="relative block">
                <span className="relative z-10"> Modern Craftsmanship</span>
                <span
                  className="absolute inset-x-0 bottom-1 h-3 -z-0 rounded-none"
                  style={{ backgroundColor: `${BRAND}99` }}
                />
              </span>
            </h1>
            <p className="mt-5 text-base text-neutral-600 max-w-prose">
              Quality-made apparel tailored to your needs. We blend design,
              ethics, and precision to deliver garments that stand out.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <AnimatedButton asChild variant="primary">
                <Link href="/rfq">Request a Quotation</Link>
              </AnimatedButton>
              <AnimatedButton asChild variant="outline">
                <Link href="/design-studio">
                  Book a Demo
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </AnimatedButton>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div
              className="w-full rounded-none border-[3px] overflow-hidden"
              style={{ borderColor: INK, boxShadow: `8px 8px 0 0 ${INK}` }}
            >
              <Image
                src={"/fashion-designer-studio.png"}
                alt="Editorial fashion models"
                width={900}
                height={640}
                className="w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Energy strip */}
      <MarqueeStrip
        items={[
          "Delivering Unmatched Apparel Quality",
          "Sustainability at the Core",
          "On‑Time Production",
          "Design to Doorstep",
        ]}
      />

      {/* Brands */}
      <section className="px-4 md:px-8 lg:px-12">
        <BrandRow />
      </section>

      {/* Features */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <Card
            className="rounded-none border-[3px]"
            style={{ borderColor: INK, boxShadow: `6px 6px 0 0 ${INK}` }}
          >
            <CardHeader className="flex flex-row items-center gap-3">
              <div
                className="p-2 rounded-none border-[3px]"
                style={{ backgroundColor: `${BRAND}22`, borderColor: INK }}
              >
                <BadgeCheck style={{ color: BRAND }} />
              </div>
              <CardTitle className="font-bold">
                Unmatched Quality Control
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-700">
              Experience superior standards at every step. From sampling to
              shipment, strict QA ensures consistency and durability—on time.
            </CardContent>
          </Card>

          <Card
            className="rounded-none border-[3px]"
            style={{ borderColor: INK, boxShadow: `6px 6px 0 0 ${INK}` }}
          >
            <CardHeader className="flex flex-row items-center gap-3">
              <div
                className="p-2 rounded-none border-[3px]"
                style={{ backgroundColor: `${BRAND}22`, borderColor: INK }}
              >
                <Leaf style={{ color: BRAND }} />
              </div>
              <CardTitle className="font-bold">Sustainable Sourcing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-700">
              Responsible materials, ethical partners, and reduced waste
              practices—built into our supply chain for conscious scale.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About the company */}
      <AboutSection />

      {/* Design Studio teaser */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            eyebrow="Design Studio"
            title="Crafted for Quality, Made for You"
          />
          <p className="mt-3 text-sm text-neutral-600 max-w-prose">
            Browse a curated selection from our design studio. Ready to
            customize for your brand.
          </p>

          <div className="mt-8">
            <ProductSlideShow products={products?.slice(0, 8)} />
          </div>
        </div>
      </section>

      {/* Video / Story */}
      <section className="px-4 md:px-8 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 items-center">
          <div
            className="aspect-video w-full rounded-none border-[3px] grid place-content-center"
            style={{ borderColor: INK, boxShadow: `6px 6px 0 0 ${INK}` }}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div
                className="p-4 rounded-none"
                style={{
                  backgroundColor: BRAND,
                  color: INK,
                  border: `3px solid ${INK}`,
                  boxShadow: `4px 4px 0 0 ${INK}`,
                }}
              >
                <Play className="size-6" />
              </div>
              <p className="text-sm text-neutral-600">Brand film placeholder</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold">A Legacy of Fashion Sourcing</h3>
            <p className="mt-3 text-neutral-700">
              Over 15 years in apparel development—combining design, sourcing,
              and QA to bring your collections to market, ethically and
              efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      <Separator />

      {/* Contact */}
      <section id="contact" className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <div
            className="relative rounded-none border-[3px] overflow-hidden"
            style={{ borderColor: INK, boxShadow: `8px 8px 0 0 ${INK}` }}
          >
            <Image
              src={"/fashion-worker-at-desk.png"}
              alt="Studio phone booth"
              width={900}
              height={640}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <AnimatedButton asChild variant="primary">
                <a
                  href="https://wa.me/+8801912563709"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp us"
                >
                  <MessageCircle className="size-4 mr-2" /> WhatsApp Us
                </a>
              </AnimatedButton>
            </div>
          </div>

          <Card
            className="rounded-none border-[3px]"
            style={{ borderColor: INK, boxShadow: `8px 8px 0 0 ${INK}` }}
          >
            <CardHeader>
              <CardTitle className="font-black">
                Let&apos;s Collaborate
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Input
                value={mailData.name}
                onChange={(e) =>
                  setMailData({ ...mailData, name: e.target.value })
                }
                required
                placeholder="Your Name"
                className="rounded-none border-[3px]"
                style={{ borderColor: INK }}
              />
              <Input
                value={mailData.email}
                onChange={(e) =>
                  setMailData({ ...mailData, email: e.target.value })
                }
                required
                placeholder="Email"
                type="email"
                className="rounded-none border-[3px]"
                style={{ borderColor: INK }}
              />
              <Input
                value={mailData.phone}
                onChange={(e) =>
                  setMailData({ ...mailData, phone: e.target.value })
                }
                required
                placeholder="Phone"
                type="tel"
                className="rounded-none border-[3px]"
                style={{ borderColor: INK }}
              />
              <Input
                value={mailData.subject}
                onChange={(e) =>
                  setMailData({ ...mailData, subject: e.target.value })
                }
                required
                placeholder="Subject"
                className="rounded-none border-[3px]"
                style={{ borderColor: INK }}
              />
              <Textarea
                value={mailData.mailText}
                onChange={(e) =>
                  setMailData({ ...mailData, mailText: e.target.value })
                }
                required
                placeholder="Your Text..."
                rows={6}
                className="rounded-none border-[3px]"
                style={{ borderColor: INK }}
              />
              <AnimatedButton
                onClick={() => mutate(mailData)}
                variant="primary"
              >
                Send Your Inquiry
              </AnimatedButton>
            </CardContent>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
