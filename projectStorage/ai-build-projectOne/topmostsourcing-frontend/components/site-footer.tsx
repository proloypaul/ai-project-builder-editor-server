import { Separator } from "@/components/ui/separator";
import { Facebook, Linkedin } from "lucide-react";
import Link from "next/link";

const BRAND = "#06E84E";
const INK = "#0F0F0F";

export function SiteFooter() {
  return (
    <footer className="mt-12" style={{ backgroundColor: INK, color: "white" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-12 grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-start -space-x-5  -ml-4 -mt-8">
            <img src={"/logo.png"} alt="logo" className="h-32" />{" "}
            <h3 className="text-2xl md:text-3xl font-black">
              Topmost Sourcing Ltd.
            </h3>
          </div>
          <p className="mt-2 text-sm text-neutral-300 max-w-prose">
            We deliver exceptional quality and sustainable fashion solutions.
            With a commitment to excellence and transparency, we help brands
            bring their vision to life—ethically and efficiently.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold">Quick Links</h4>
              <ul className="mt-2 space-y-1 text-sm text-neutral-300">
                <Link href={"/"}>
                  <li>Home</li>
                </Link>
                <Link href={"/design-studio"}>
                  <li>Design Studio</li>
                </Link>
                <Link href={"/community"}>
                  <li>Community</li>
                </Link>
                <Link href={"/rfq"}>
                  <li>RFQ</li>
                </Link>
                <Link href={"/why-us"}>
                  <li>Why Us</li>
                </Link>
                <Link href={"/investor"}>
                  <li>Investor</li>
                </Link>
              </ul>
            </div>
            <div>
              <h4 className="font-bold">Follow</h4>
              <div className="mt-2 flex items-center gap-3">
                <Link href={"https://www.facebook.com/Topmostsourcing/"}>
                  <Facebook className="size-5" aria-hidden="true" />
                </Link>
                <Link href={"https://bd.linkedin.com/company/topmost-sourcing"}>
                  <Linkedin className="size-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-black">Get in Touch</h3>
          <ul className="mt-4 text-sm text-neutral-300 space-y-1">
            <li>+8801912563709</li>
            <li>info@topmostsourcingltd.com</li>
            <li>topmostsourcingltd@gmail.com</li>
            <li>House #33, Road #17, Nikunja-2, Khilkhet, Dhaka-1229</li>
          </ul>
        </div>
      </div>

      {/* <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-6 border-t border-neutral-800">
        <div className="grid md:grid-cols-3 gap-4 text-xs text-neutral-400">
          <div>
            <h4 className="font-bold text-neutral-300 mb-1">
              Investment Terms
            </h4>
            <p>Min: 50,000 BDT | Max: 500,000 BDT | Returns: 16-20% annually</p>
          </div>
          <div>
            <h4 className="font-bold text-neutral-300 mb-1">
              Legal Compliance
            </h4>
            <p>All investments regulated under Bangladesh financial laws</p>
          </div>
          <div>
            <h4 className="font-bold text-neutral-300 mb-1">Risk Notice</h4>
            <p>
              Investments carry risks. Past performance doesn't guarantee future
              results
            </p>
          </div>
        </div>
      </div> */}

      <Separator className="bg-neutral-800" />
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-4 text-xs text-neutral-400">
        <span style={{ color: BRAND }}>●</span> © {new Date().getFullYear()}{" "}
        Topmost Sourcing Ltd. All rights reserved.
      </div>
    </footer>
  );
}
