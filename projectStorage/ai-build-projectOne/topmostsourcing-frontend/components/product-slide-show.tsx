import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { Product } from "@/types/data-types";
import { serverUrl } from "@/config/app-config";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AnimatedButton } from "@/components/animated-button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BRAND = "#06E84E";
const INK = "#0F0F0F";

const ProductSlideShow = ({ products }: { products: Product[] }) => {
  const router = useRouter();

  return (
    <div className="h-auto w-full relative">
      <Swiper
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          550: {
            slidesPerView: 2,
          },
          1000: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1300: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        // autoplay={{
        //   delay: 2000,
        // }}
        navigation={true}
        pagination={true}
        modules={[Pagination, Autoplay]}
        className="my-swiper !pb-16 relative !pt-6 !px-6"
      >
        {products?.map((product: Product, i: number) => (
          <SwiperSlide
            className="cursor-pointer rounded-none border-[3px] !transition-all !duration-300 !ease-out hover:-translate-y-2 hover:scale-[1.02] group"
            style={{ borderColor: INK, boxShadow: `6px 6px 0 0 ${INK}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `10px 10px 0 0 ${INK}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `6px 6px 0 0 ${INK}`;
            }}
            key={i}
          >
            <Card className="">
              <CardContent className="p-3">
                <Link href={`/products/${product?._id}`} className="block">
                  <Image
                    src={
                      `${serverUrl}/${product?.imageUrl}` ||
                      "/placeholder.svg?height=900&width=900"
                    }
                    alt={product?.name}
                    width={600}
                    height={600}
                    className="w-full aspect-[3/4] object-cover rounded-none border-[3px] transition-transform duration-300 group-hover:scale-105"
                    style={{ borderColor: INK }}
                  />
                </Link>
                <div className="mt-3">
                  <h3 className="font-bold">{product?.name}</h3>
                  <dl className="mt-1 text-xs text-neutral-700 space-y-1">
                    <div className="flex gap-1">
                      <dt className="font-semibold">Price:</dt>
                      <dd>Negotiable</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt className="font-semibold">Size:</dt>
                      <dd>{product?.sizes}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt className="font-semibold">Color:</dt>
                      <dd>{product?.colors}</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <AnimatedButton
                  asChild
                  variant="primary"
                  className="w-full rounded-none border-[3px] font-bold"
                >
                  <Link href={`/products/${product?._id}`}>View Details</Link>
                </AnimatedButton>
              </CardFooter>
            </Card>
          </SwiperSlide>
        ))}
        
          <div className="mt-6 absolute right-0">
            <AnimatedButton asChild variant="outline">
              <Link href="/design-studio">
                Explore More
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </AnimatedButton>
          </div>
      </Swiper>
    </div>
  );
};

export default ProductSlideShow;
