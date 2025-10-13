"use client"

const INK = "#0F0F0F"
const BRAND = "#06E84E"

export function BrandRow() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center">
        {["Tommy", "Zara", "Ralph", "H&M", "Calvin", "Lacoste"].map((brand, i) => (
          <div
            key={brand}
            className="h-14 grid place-content-center text-[11px] sm:text-xs font-bold uppercase tracking-wide bg-white rounded-none border-[3px] transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer"
            style={{
              borderColor: INK,
              boxShadow: i % 2 === 0 ? `4px 4px 0 0 ${INK}` : `-4px 4px 0 0 ${INK}`,
            }}
            onMouseEnter={(e) => {
              const shadow = i % 2 === 0 ? `6px 6px 0 0 ${INK}` : `-6px 6px 0 0 ${INK}`
              e.currentTarget.style.boxShadow = shadow
            }}
            onMouseLeave={(e) => {
              const shadow = i % 2 === 0 ? `4px 4px 0 0 ${INK}` : `-4px 4px 0 0 ${INK}`
              e.currentTarget.style.boxShadow = shadow
            }}
            aria-label={`${brand} logo placeholder`}
          >
            <span className="px-2" style={{ color: i % 3 === 0 ? BRAND : INK }}>
              {brand}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
