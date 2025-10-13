"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnimatedButton } from "@/components/animated-button";
import { useState } from "react";
import { Blog } from "@/types/data-types";
import { InfiniteData, useQuery } from "@tanstack/react-query";
import { getBlogOption, getBlogsOption } from "@/services/query-options";
import { serverUrl } from "@/config/app-config";
import ProductDescription from "@/components/product-description";
import { useParams } from "next/navigation";

const BRAND = "#06E84E";
const INK = "#0F0F0F";

function RelatedArticlesCarousel({ blogs }: { blogs: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, blogs?.length - itemsPerView + 1);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Related Articles</h3>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-2 border-[3px] rounded-none disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            style={{ borderColor: INK, boxShadow: `3px 3px 0 0 ${INK}` }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className="p-2 border-[3px] rounded-none disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
            style={{ borderColor: INK, boxShadow: `3px 3px 0 0 ${INK}` }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {blogs?.map((relatedBlog: Blog) => (
            <div
              key={relatedBlog._id}
              className="flex-shrink-0"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <Card
                className="rounded-none border-[3px] overflow-hidden"
                style={{ borderColor: INK, boxShadow: `4px 4px 0 0 ${INK}` }}
              >
                <div className="aspect-video relative">
                  <Image
                    src={
                      `${serverUrl}/${relatedBlog.imageUrl}` ||
                      "/placeholder.svg"
                    }
                    alt={relatedBlog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-none border-[2px]"
                      style={{
                        borderColor: INK,
                        backgroundColor: BRAND,
                        color: INK,
                      }}
                    >
                      {relatedBlog.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mb-2 line-clamp-2">
                    {relatedBlog.title}
                  </h4>
                  <p className="text-xs text-neutral-600 mb-3">
                    {new Date(relatedBlog.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <Link href={`/community/${relatedBlog._id}`}>
                    <button
                      className="w-full px-4 py-2 font-bold text-sm border-[3px] rounded-none transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                      style={{
                        backgroundColor: BRAND,
                        borderColor: INK,
                        color: INK,
                        boxShadow: `3px 3px 0 0 ${INK}`,
                      }}
                    >
                      View details
                    </button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlogDetailPage() {
  const { id } = useParams();

  const { data: blog } = useQuery(getBlogOption(id as string));

  const { data } = useQuery(
    getBlogsOption(`&category=${blog?.category as string}`)
  );

  const relatedBlogs = (data as any)?.blogs?.filter(
    (b: Blog) => b._id !== blog?._id
  );

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      <article className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/community"
            className="inline-flex items-center gap-2 mb-8 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={20} />
            <span className="font-bold">Back to Community</span>
          </Link>

          {/* Blog Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {blog?.title}
            </h1>
            <h2 className="text-xl text-neutral-600 mb-4">{blog?.subtitle}</h2>
            <div className="flex items-center gap-4">
              <p className="text-sm text-neutral-500">
                {new Date(blog?.createdAt).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <span
                className="text-xs font-bold px-2 py-1 rounded-none border-[2px]"
                style={{ borderColor: INK, backgroundColor: BRAND, color: INK }}
              >
                {blog?.category}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <div
              className="aspect-video relative rounded-none border-[3px] overflow-hidden"
              style={{ borderColor: INK, boxShadow: `6px 6px 0 0 ${INK}` }}
            >
              <Image
                src={`${serverUrl}/${blog?.imageUrl}` || "/placeholder.svg"}
                alt={'blog'}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Blog Content */}
          <ProductDescription desc={blog?.description} />

          <div className="mb-12">
            <h4 className="text-lg font-bold mb-4">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {blog?.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-sm px-3 py-2 border-[2px] rounded-none font-bold"
                  style={{
                    borderColor: INK,
                    backgroundColor: BRAND,
                    color: INK,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <section className="mt-16">
            <RelatedArticlesCarousel blogs={relatedBlogs || []} />
          </section>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
