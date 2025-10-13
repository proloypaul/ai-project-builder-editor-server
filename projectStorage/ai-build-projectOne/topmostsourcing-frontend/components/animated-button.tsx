"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { forwardRef, type ButtonHTMLAttributes } from "react"

const BRAND = "#06E84E"
const INK = "#0F0F0F"

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline"
  children: React.ReactNode
  asChild?: boolean
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ variant = "primary", children, className = "", ...props }, ref) => {
    const isPrimary = variant === "primary"

    return (
      <Button
        ref={ref}
        className={`
          rounded-none border-[3px] font-bold 
          transition-all duration-300 ease-out
          hover:scale-105 hover:-translate-y-1
          active:scale-95 active:translate-y-0
          ${isPrimary ? "" : "bg-white hover:bg-white"}
          ${className}
        `}
        style={{
          backgroundColor: isPrimary ? BRAND : "white",
          color: INK,
          borderColor: INK,
          boxShadow: `4px 4px 0 0 ${INK}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `6px 6px 0 0 ${INK}`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `4px 4px 0 0 ${INK}`
        }}
        {...props}
      >
        {children}
      </Button>
    )
  },
)

AnimatedButton.displayName = "AnimatedButton"
