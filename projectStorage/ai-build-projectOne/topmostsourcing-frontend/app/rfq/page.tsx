"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AnimatedButton } from "@/components/animated-button"

const BRAND = "#06E84E"
const INK = "#0F0F0F"

export default function RFQPage() {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    // Handle file drop logic here
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      <section className="px-4 md:px-8 lg:px-12 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-4">Request For Quotation</h1>
          </div>

          <Card className="rounded-none border-[3px]" style={{ borderColor: INK, boxShadow: `8px 8px 0 0 ${INK}` }}>
            <CardContent className="p-8">
              {/* File Upload Area */}
              <div
                className={`border-[3px] border-dashed p-12 text-center mb-8 transition-colors ${
                  dragActive ? "border-green-500 bg-green-50" : ""
                }`}
                style={{ borderColor: dragActive ? BRAND : INK }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-none border-[3px]" style={{ borderColor: INK }}>
                    <Upload className="size-8" style={{ color: INK }} />
                  </div>
                  <div>
                    <AnimatedButton variant="primary">Upload files</AnimatedButton>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Name</label>
                  <Input placeholder="Name" className="rounded-none border-[3px]" style={{ borderColor: INK }} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Email</label>
                  <Input
                    placeholder="abc@xyz.com"
                    type="email"
                    className="rounded-none border-[3px]"
                    style={{ borderColor: INK }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Phone</label>
                  <Input
                    placeholder="+8801234567890"
                    type="tel"
                    className="rounded-none border-[3px]"
                    style={{ borderColor: INK }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Product Tags</label>
                  <Input placeholder="tags" className="rounded-none border-[3px]" style={{ borderColor: INK }} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Title</label>
                  <Input
                    placeholder="product title"
                    className="rounded-none border-[3px]"
                    style={{ borderColor: INK }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                    Target Price
                    <div className="flex items-center gap-2">
                      <Checkbox id="negotiable" />
                      <label htmlFor="negotiable" className="text-xs">
                        Negotiable
                      </label>
                    </div>
                  </label>
                  <Input className="rounded-none border-[3px]" style={{ borderColor: INK }} />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold mb-2">Short Description</label>
                <Textarea
                  placeholder="description"
                  rows={4}
                  className="rounded-none border-[3px]"
                  style={{ borderColor: INK }}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Quantity</label>
                  <div className="flex gap-2">
                    <Input placeholder="Min" className="rounded-none border-[3px]" style={{ borderColor: INK }} />
                    <span className="flex items-center">to</span>
                    <select className="px-3 py-2 border-[3px] rounded-none flex-1" style={{ borderColor: INK }}>
                      <option>Select an option</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Payment method</label>
                  <select className="w-full px-3 py-2 border-[3px] rounded-none" style={{ borderColor: INK }}>
                    <option>Select an option</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Destination</label>
                  <select className="w-full px-3 py-2 border-[3px] rounded-none" style={{ borderColor: INK }}>
                    <option>Select an option</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Expected delivery date</label>
                  <Input
                    placeholder="mm/dd/yyyy"
                    type="date"
                    className="rounded-none border-[3px]"
                    style={{ borderColor: INK }}
                  />
                </div>
              </div>

              <div className="mt-8 text-center">
                <AnimatedButton variant="primary" className="px-12">
                  Submit
                </AnimatedButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
