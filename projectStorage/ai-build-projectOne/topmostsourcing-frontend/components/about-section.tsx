"use client"

import Image from "next/image"
import { BadgeCheck, Leaf, Truck } from "lucide-react"
import { SectionTitle } from "./section-title"

const BRAND = "#06E84E"
const INK = "#0F0F0F"

export function AboutSection() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-14">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
        <div
          className="rounded-none border-[3px] overflow-hidden relative transition-all duration-500 hover:scale-[1.02] group"
          style={{
            borderColor: INK,
            boxShadow: `10px 10px 0 0 ${INK}`,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(15,15,15,0.08) 23px), repeating-linear-gradient(90deg, transparent, transparent 22px, rgba(15,15,15,0.08) 23px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `15px 15px 0 0 ${INK}`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `10px 10px 0 0 ${INK}`
          }}
        >
          <Image
            src={"/fashion-business-meeting.png"}
            alt="Our atelier at work"
            width={960}
            height={720}
            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
          />
          <span
            className="absolute top-4 left-4 text-[10px] font-black px-2 py-1 rounded-none border-[3px] transition-all duration-300 hover:scale-110 hover:rotate-3"
            style={{ backgroundColor: BRAND, color: INK, borderColor: INK, boxShadow: `4px 4px 0 0 ${INK}` }}
          >
            Since 2010
          </span>
        </div>

        <div>
          <SectionTitle eyebrow="About the Company" title="Always Good, All Ways" />
          <p className="mt-4 text-neutral-700">
            We’re a design-led sourcing studio crafting apparel with purpose and precision. From fabric selection to
            final delivery, we provide transparent processes, ethical production, and iron‑clad quality control.
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <BadgeCheck style={{ color: BRAND }} className="mt-0.5" />
              Superior QA at each stage—sampling, fitting, bulk.
            </li>
            <li className="flex items-start gap-3">
              <Leaf style={{ color: BRAND }} className="mt-0.5" />
              Responsible materials and factories with fair practices.
            </li>
            <li className="flex items-start gap-3">
              <Truck style={{ color: BRAND }} className="mt-0.5" />
              On‑time delivery and transparent tracking.
            </li>
          </ul>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { k: "15+", v: "Years" },
              { k: "80+", v: "Factories" },
              { k: "45", v: "MOQ Friendly" },
              { k: "18", v: "Countries" },
            ].map((s, i) => (
              <div
                key={s.v}
                className="rounded-none border-[3px] p-3 text-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer"
                style={{
                  borderColor: INK,
                  boxShadow: i % 2 === 0 ? `6px 6px 0 0 ${INK}` : `-6px 6px 0 0 ${INK}`,
                  backgroundColor: i % 3 === 0 ? `${BRAND}22` : "white",
                }}
                onMouseEnter={(e) => {
                  const shadow = i % 2 === 0 ? `8px 8px 0 0 ${INK}` : `-8px 8px 0 0 ${INK}`
                  e.currentTarget.style.boxShadow = shadow
                }}
                onMouseLeave={(e) => {
                  const shadow = i % 2 === 0 ? `6px 6px 0 0 ${INK}` : `-6px 6px 0 0 ${INK}`
                  e.currentTarget.style.boxShadow = shadow
                }}
              >
                <div className="text-2xl font-black">{s.k}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
