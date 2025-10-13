"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating geometric shapes that follow cursor subtly */}
      <div
        className="absolute w-4 h-4 border-2 border-[#06E84E] opacity-20 transition-all duration-1000 ease-out"
        style={{
          transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
          left: "10%",
          top: "20%",
        }}
      />
      <div
        className="absolute w-6 h-6 border-2 border-[#0F0F0F] opacity-10 transition-all duration-1500 ease-out rotate-45"
        style={{
          transform: `translate(${mousePos.x * -0.01}px, ${mousePos.y * -0.01}px) rotate(45deg)`,
          right: "15%",
          top: "60%",
        }}
      />
      <div
        className="absolute w-3 h-3 bg-[#06E84E] opacity-15 transition-all duration-800 ease-out"
        style={{
          transform: `translate(${mousePos.x * 0.015}px, ${mousePos.y * 0.015}px)`,
          left: "80%",
          top: "30%",
        }}
      />
    </div>
  )
}
