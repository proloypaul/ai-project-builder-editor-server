import { ProductCard } from "@/components/product-card";
import { Product } from "@/types/data-types";

type Props = {
  products?: Product[];
};

export function ProductGrid({ products = [] }: Props) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products?.length > 0 &&
        products?.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}
