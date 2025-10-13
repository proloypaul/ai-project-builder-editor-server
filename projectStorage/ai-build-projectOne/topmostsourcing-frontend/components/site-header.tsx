"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const BRAND = "#06E84E";
const INK = "#0F0F0F";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.height = "100vh";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b-0">
        <div
          className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 h-16 flex items-center justify-between rounded-none border-b-[3px]"
          style={{ borderColor: INK }}
        >
          <Link
            href="/"
            className="font-black tracking-tight leading-5 sm:text-lg flex items-center justify-start -space-x-3 -ml-4"
          >
            <img src={"/logo.png"} alt="logo" className="h-20" />
            <p>TOPMOST SOURCING LTD</p>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold uppercase">
            <Link href="/" className="hover:underline underline-offset-4">
              Home
            </Link>
            <Link
              href="/design-studio"
              className="hover:underline underline-offset-4"
            >
              Design Studio
            </Link>
            <Link
              href="/community"
              className="hover:underline underline-offset-4"
            >
              Community
            </Link>
            <Link href="/rfq" className="hover:underline underline-offset-4">
              RFQ
            </Link>
            <Link href="/why-us" className="hover:underline underline-offset-4">
              Why Us
            </Link>
            <Link
              href="/investor"
              className="hover:underline underline-offset-4"
            >
              Investor
            </Link>
          </nav>
          <Button
            asChild
            size="sm"
            className="max-sm:hidden rounded-none border-[3px] font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            style={{
              backgroundColor: BRAND,
              color: INK,
              borderColor: INK,
              boxShadow: `4px 4px 0 0 ${INK}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `6px 6px 0 0 ${INK}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `4px 4px 0 0 ${INK}`;
            }}
          >
            <a
              href="https://wa.me/+8801912563709"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4 mr-2" />
              WhatsApp Us
            </a>
          </Button>
          <Menu className="sm:hidden" onClick={() => setIsOpen(true)} />
        </div>
      </header>
      <div
        className={`bg-black/70 fixed inset-0 h-screen z-[99] transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav
          className={`relative bg-white w-full h-full p-6 pt-14 flex flex-col items-start gap-6 text-lg font-bold uppercase`}
        >
          <X
            className="absolute top-3 right-3"
            onClick={() => setIsOpen(false)}
          />
          {/* <Link
              href="/"
              className="font-black tracking-tight leading-5 sm:text-lg flex items-center justify-start -space-x-3 -ml-4"
            >
              <img src={"/logo.png"} alt="logo" className="h-20" />
              <p>TOPMOST SOURCING LTD</p>
            </Link> */}
          <Link href="/" className="hover:underline underline-offset-4">
            Home
          </Link>
          <Link
            href="/design-studio"
            className="hover:underline underline-offset-4"
          >
            Design Studio
          </Link>
          <Link
            href="/community"
            className="hover:underline underline-offset-4"
          >
            Community
          </Link>
          <Link href="/rfq" className="hover:underline underline-offset-4">
            RFQ
          </Link>
          <Link href="/why-us" className="hover:underline underline-offset-4">
            Why Us
          </Link>
          <Link href="/investor" className="hover:underline underline-offset-4">
            Investor
          </Link>
          <Button
            asChild
            size="sm"
            className="sm:hidden rounded-none border-[3px] font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-1 mt-auto"
            style={{
              backgroundColor: BRAND,
              color: INK,
              borderColor: INK,
              boxShadow: `4px 4px 0 0 ${INK}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `6px 6px 0 0 ${INK}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `4px 4px 0 0 ${INK}`;
            }}
          >
            <a
              href="https://wa.me/+8801912563709"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4 mr-2" />
              WhatsApp Us
            </a>
          </Button>
        </nav>
      </div>
    </>
  );
}
