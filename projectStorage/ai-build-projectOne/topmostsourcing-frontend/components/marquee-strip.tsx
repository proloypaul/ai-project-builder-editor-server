"use client"

type Props = {
  items: string[]
  brandColor?: string
  ink?: string
  speedMs?: number
}

export function MarqueeStrip({ items, brandColor = "#06E84E", ink = "#0F0F0F", speedMs = 15000 }: Props) {
  const content = items.join("   ★   ")
  return (
    <div
      className="overflow-hidden border-y-[3px] py-2 select-none"
      style={{ backgroundColor: `${brandColor}33`, borderColor: ink, color: ink }}
      aria-label="Scrolling highlights"
    >
      <div className="whitespace-nowrap font-black uppercase tracking-wider text-sm will-change-transform marquee">
        {content} {content}
      </div>

      <style jsx>{`
        .marquee {
          animation: m ${speedMs}ms linear infinite;
        }
        @keyframes m {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}
