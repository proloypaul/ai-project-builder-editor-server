"use client";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getBlogsOption, getCategoriesOption } from "@/services/query-options";
import { useState } from "react";
import { serverUrl } from "@/config/app-config";
import { Category } from "@/types/data-types";

const BRAND = "#06E84E";
const INK = "#0F0F0F";

export default function CommunityPage() {
  const [query, setQuery] = useState("");
  const { data: categories } = useQuery(getCategoriesOption());
  const [category, setCategory] = useState<string>("");

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(getBlogsOption(`&query=${query}&category=${category}`));

  const blogs = data?.pages.flatMap((page) => page.blogs);
  //const pagination = data?.pages?.[0]?.pagination;

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteHeader />

      {/* Header Section */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold">Type:</span>
              <select
                className="px-3 py-1 border-[3px] rounded-none font-bold"
                style={{ borderColor: INK }}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All</option>
                {categories?.map((category: Category, i: number) => (
                  <option key={i} value={category?.name}>
                    {category?.name?.charAt(0).toUpperCase() +
                      category?.name?.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative max-w-sm">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4"
                style={{ color: INK }}
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="pl-10 rounded-none border-[3px]"
                style={{ borderColor: INK }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs?.map((blog) => (
              <Card
                key={blog._id}
                className="rounded-none border-[3px] overflow-hidden"
                style={{ borderColor: INK, boxShadow: `4px 4px 0 0 ${INK}` }}
              >
                <div className="aspect-video relative">
                  <Image
                    src={`${serverUrl}/${blog?.imageUrl}` || "/placeholder.svg"}
                    alt={"blog"}
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
                      {blog.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-neutral-600 mb-3">
                    {new Date(blog?.createdAt)?.toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {blog?.tags?.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 border-[1px] rounded-none"
                        style={{ borderColor: INK, color: INK }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link href={`/community/${blog?._id}`}>
                    <button
                      className="w-full px-4 py-2 font-bold text-sm border-[3px] rounded-none transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                      style={{
                        backgroundColor: BRAND,
                        borderColor: INK,
                        color: INK,
                        boxShadow: `3px 3px 0 0 ${INK}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `1px 1px 0 0 ${INK}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `3px 3px 0 0 ${INK}`;
                      }}
                    >
                      View details
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-12">
            {/* <button
              disabled={pagination?.hasPreviousPage === false}
              className="px-4 py-2 font-bold text-sm border-[3px] rounded-none transition-all duration-200 hover:translate-x-1 hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "white",
                borderColor: INK,
                color: INK,
                boxShadow: `3px 3px 0 0 ${INK}`,
              }}
            >
              Previous Page
            </button> */}

            {/* {Array.from(
              { length: pagination?.totalPages },
              (_, i) => i + 1
            ).map((pageNum) => (
              <button
                key={pageNum}
                className={`px-3 py-2 font-bold text-sm border-[3px] rounded-none transition-all duration-200 hover:translate-x-1 hover:translate-y-1 ${
                  pageNum === pagination?.page ? "opacity-100" : "opacity-70"
                }`}
                style={{
                  backgroundColor:
                    pageNum === pagination?.page ? BRAND : "white",
                  borderColor: INK,
                  color: INK,
                  boxShadow: `3px 3px 0 0 ${INK}`,
                }}
              >
                {pageNum}
              </button>
            ))} */}

            <button
              disabled={!hasNextPage}
              className="px-4 py-2 font-bold text-sm border-[3px] rounded-none transition-all duration-200 hover:translate-x-1 hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "white",
                borderColor: INK,
                color: INK,
                boxShadow: `3px 3px 0 0 ${INK}`,
              }}
              onClick={() => fetchNextPage()}
            >
              Load More
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
