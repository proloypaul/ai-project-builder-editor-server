"use client";
import Image from "next/image";
import { Play, MapPin, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnimatedButton } from "@/components/animated-button";
import { BrandRow } from "@/components/brand-row";

const BRAND = "#06E84E";
const INK = "#0F0F0F";

export default function WhyUsPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      {/* Hero Section */}
      <section className="px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div
              className="p-8 rounded-none border-[3px]"
              style={{
                backgroundColor: BRAND,
                borderColor: INK,
                boxShadow: `8px 8px 0 0 ${INK}`,
              }}
            >
              <h1
                className="text-4xl md:text-5xl font-black leading-tight"
                style={{ color: INK }}
              >
                Crafting Fashion
                <br />
                with Purpose
                <br />
                and Precision
              </h1>
              <div className="mt-6 flex items-center gap-4">
                <span className="text-6xl font-black" style={{ color: INK }}>
                  ✱
                </span>
                <span className="text-6xl font-black" style={{ color: INK }}>
                  ✕
                </span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div
              className="w-full rounded-none border-[3px] overflow-hidden"
              style={{ borderColor: INK, boxShadow: `8px 8px 0 0 ${INK}` }}
            >
              <Image
                src="/garment-worker-hands.png"
                alt="Fashion model"
                width={500}
                height={600}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Description */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div
            className="bg-gray-50 p-8 rounded-none border-[3px]"
            style={{ borderColor: INK }}
          >
            <p className="text-sm leading-relaxed">
              At Topmost Sourcing, we are committed to delivering high-quality
              fashion sourcing solutions. With over 10 years of industry
              expertise, we bring a unique blend of quality control, ethical
              sourcing, and seamless transparency to every project. Our goal is
              excellence, from raw material selection to final delivery. We work
              hand-in-hand with our clients, offering expert guidance,
              competitive pricing, and a streamlined process that delivers
              results on time, every time. Whether you're scaling up for mass
              production, sustainable sourcing, or a trusted partner to scale
              your fashion business, we're here to ensure your success—without
              compromise.
            </p>
            <div className="mt-6">
              <AnimatedButton variant="outline">Learn more →</AnimatedButton>
            </div>
          </div>
          <div className="flex justify-center">
            <div
              className="w-32 h-32 rounded-full border-[3px] flex items-center justify-center"
              style={{ borderColor: INK }}
            >
              <span className="text-2xl font-black">👤</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <BrandRow />
      </section>

      {/* Video Section */}
      <section className="px-4 md:px-8 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-8">
            A Legacy of Fashion Sourcing
          </h2>
          <div
            className="aspect-video w-full max-w-4xl mx-auto rounded-none border-[3px] grid place-content-center bg-black"
            style={{ borderColor: INK, boxShadow: `8px 8px 0 0 ${INK}` }}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className="p-6 rounded-none"
                style={{
                  backgroundColor: BRAND,
                  color: INK,
                  border: `3px solid ${INK}`,
                  boxShadow: `4px 4px 0 0 ${INK}`,
                }}
              >
                <Play className="size-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Control & Sustainability */}
      <section className="px-4 md:px-8 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <Card
            className="rounded-none border-[3px]"
            style={{ borderColor: INK, boxShadow: `6px 6px 0 0 ${INK}` }}
          >
            <CardHeader>
              <CardTitle className="font-black">
                Unmatched Quality Control
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-700">
              <p>
                Our best quality assurance team has developed stringent quality
                control systems that track and monitor the entire cycle of any
                production process—from sampling to final delivery. We ensure
                that every garment meets the highest standards of craftsmanship.
                Whether it's fabric strength or stitch consistency, our
                meticulous quality control delivers excellence that stands out
                in a competitive marketplace.
              </p>
            </CardContent>
          </Card>

          <Card
            className="rounded-none border-[3px]"
            style={{ borderColor: INK, boxShadow: `6px 6px 0 0 ${INK}` }}
          >
            <CardHeader>
              <CardTitle className="font-black" style={{ color: BRAND }}>
                Sustainable Sourcing
              </CardTitle>
              <p className="text-sm font-bold" style={{ color: BRAND }}>
                Ethical and Environmentally Conscious Practices
              </p>
            </CardHeader>
            <CardContent className="text-sm text-neutral-700">
              <p>
                Topmost takes a holistic approach to sustainability and
                sustainable sourcing practices. We prioritize sustainability in
                every aspect of production, from raw material sourcing to final
                delivery. Our commitment to ethical practices ensures that every
                garment is produced with respect for both people and the planet.
                We work with certified suppliers who share our values of
                environmental responsibility and social accountability for
                sustainability.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="px-4 md:px-8 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <Card
            className="rounded-none border-[3px] bg-gray-100"
            style={{ borderColor: INK, boxShadow: `4px 4px 0 0 ${INK}` }}
          >
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="size-5" style={{ color: BRAND }} />
                <h3 className="font-bold">Location</h3>
              </div>
              <p className="text-sm">
                House #02, Road #11
                <br />
                Nikunja-2, Khilkhet,
                <br />
                Dhaka-1229
              </p>
            </CardContent>
          </Card>

          <Card
            className="rounded-none border-[3px] bg-gray-100"
            style={{ borderColor: INK, boxShadow: `4px 4px 0 0 ${INK}` }}
          >
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-2">
                <Mail className="size-5" style={{ color: BRAND }} />
                <h3 className="font-bold">Email</h3>
              </div>
              <p className="text-sm">
                info@topmostsourcing.com
                <br />
                topmostsourcing@gmail.com
              </p>
            </CardContent>
          </Card>

          <Card
            className="rounded-none border-[3px] bg-gray-100"
            style={{ borderColor: INK, boxShadow: `4px 4px 0 0 ${INK}` }}
          >
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-2">
                <Phone className="size-5" style={{ color: BRAND }} />
                <h3 className="font-bold">Phone</h3>
              </div>
              <p className="text-sm">
                +8801710690983
                <br />
                +8801912563709
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Collaboration Form */}
      <section className="px-4 md:px-8 lg:px-12 py-12">
        <div className="max-w-2xl mx-auto">
          <Card
            className="rounded-none border-[3px]"
            style={{ borderColor: INK, boxShadow: `8px 8px 0 0 ${INK}` }}
          >
            <CardHeader>
              <CardTitle className="text-center text-2xl font-black">
                Let's Collaborate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Your Name"
                className="rounded-none border-[3px]"
                style={{ borderColor: INK }}
              />
              <Input
                placeholder="Email"
                type="email"
                className="rounded-none border-[3px]"
                style={{ borderColor: INK }}
              />
              <Input
                placeholder="Phone"
                type="tel"
                className="rounded-none border-[3px]"
                style={{ borderColor: INK }}
              />
              <Input
                placeholder="Subject"
                className="rounded-none border-[3px]"
                style={{ borderColor: INK }}
              />
              <Textarea
                placeholder="Your Message..."
                rows={6}
                className="rounded-none border-[3px]"
                style={{ borderColor: INK }}
              />
              <div className="text-center">
                <AnimatedButton variant="primary" className="px-12">
                  Send Your Inquiry
                </AnimatedButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
