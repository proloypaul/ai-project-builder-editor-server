"use client"

import { Star } from "lucide-react"

const BRAND = "#06E84E"
const INK = "#0F0F0F"

type Testimonial = {
  name: string
  role: string
  company: string
  quote: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Maya L.",
    role: "Head of Merch",
    company: "Zara (Vendor)",
    quote:
      "Topmost delivers consistent quality with impressive speed. Their fittings are on point and communication is clear.",
  },
  {
    name: "Ethan R.",
    role: "Production Lead",
    company: "Calvin Klein (Partner)",
    quote: "They handle complex developments with ease. Sustainable fabric options and QA make them a go‑to team.",
  },
  {
    name: "Aisha K.",
    role: "Founder",
    company: "Boutique Label",
    quote:
      "From small MOQ to scale, the team supported us like an in‑house studio. Reliable timelines and great finishing.",
  },
]

export function Testimonials() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-14">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
        <div className="text-center flex flex-col">
          <div
            className="w-fit ml-12 px-2 py-1 text-[10px] font-black tracking-widest uppercase rounded-none border-[3px]"
            style={{ borderColor: INK, color: INK, backgroundColor: `${BRAND}55` }}
          >
            Clients
          </div>
          <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight inline-block relative">
            What Partners Say
            <span className="absolute inset-x-0 -bottom-1 h-2" style={{ backgroundColor: `${BRAND}99` }} />
          </h2>
          <p className="mt-3 text-neutral-700 max-w-2xl mx-auto">
            A few words from brands and factories we collaborate with.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.name}
              className={`relative rounded-none border-[3px] p-5 bg-white transition-all duration-300 hover:scale-105 cursor-pointer ${
                i === 1 ? "md:rotate-1 hover:rotate-2" : "md:-rotate-1 hover:-rotate-2"
              }`}
              style={{ borderColor: INK, boxShadow: i % 2 === 0 ? `8px 8px 0 0 ${INK}` : `-8px 8px 0 0 ${INK}` }}
              onMouseEnter={(e) => {
                const shadow = i % 2 === 0 ? `12px 12px 0 0 ${INK}` : `-12px 12px 0 0 ${INK}`
                e.currentTarget.style.boxShadow = shadow
              }}
              onMouseLeave={(e) => {
                const shadow = i % 2 === 0 ? `8px 8px 0 0 ${INK}` : `-8px 8px 0 0 ${INK}`
                e.currentTarget.style.boxShadow = shadow
              }}
            >
              {/* tape */}
              <div
                className="absolute -top-3 left-6 w-14 h-5 rotate-[-8deg] transition-transform duration-300 group-hover:rotate-[-12deg]"
                style={{ backgroundColor: `${BRAND}AA` }}
                aria-hidden="true"
              />
              <div
                className="absolute -top-3 right-6 w-14 h-5 rotate-[8deg] transition-transform duration-300 group-hover:rotate-[12deg]"
                style={{ backgroundColor: `${BRAND}AA` }}
                aria-hidden="true"
              />

              <div className="flex items-center gap-1 text-black">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="size-4"
                    style={{ color: s < 5 ? INK : "#bbb", fill: s < 5 ? INK : "transparent" }}
                  />
                ))}
              </div>
              <p className="mt-3 text-neutral-800 text-sm leading-relaxed">“{t.quote}”</p>
              <div className="mt-4 text-xs font-bold uppercase tracking-wide">
                {t.name} — {t.role}
                <span className="text-neutral-500 normal-case font-medium"> · {t.company}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
