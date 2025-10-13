type Props = {
  eyebrow?: string
  title: string
  align?: "left" | "center"
  brandColor?: string
}

export function SectionTitle({ eyebrow, title, align = "left", brandColor = "#06E84E" }: Props) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} flex flex-col`}>
      {eyebrow ? (
        <div
          className="w-fit px-2 py-1 text-[10px] font-black tracking-widest uppercase rounded-none border-[3px]"
          style={{ borderColor: "#0F0F0F", color: "#0F0F0F", backgroundColor: `${brandColor}55` }}
        >
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight leading-[1.05] relative w-fit">
        <span className="relative z-10">{title}</span>
        <span
          className="absolute inset-x-0 -bottom-1 h-2 -z-0"
          style={{ backgroundColor: `${brandColor}99` }}
          aria-hidden="true"
        />
      </h2>
    </div>
  )
}
