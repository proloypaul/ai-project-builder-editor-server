export type Product = {
  slug: string
  name: string
  sizes: string[]
  colors: string[]
  images: string[]
  category: "design" | "ready"
  quantity?: number
}

export const products: Product[] = [
  {
    slug: "boys-tshirt-1",
    name: "Boy’s t-shirt",
    sizes: ["XXL", "XL", "L"],
    colors: ["Red", "Blue"],
    images: [
      "/placeholder-nob1f.png",
      "/white-t-shirt-side-male-model.png",
      "/white-t-shirt-back-male-model.png",
      "/white-t-shirt-detail.png",
    ],
    category: "design",
    quantity: 45,
  },
  {
    slug: "boys-tshirt-2",
    name: "Boy’s t-shirt",
    sizes: ["XXL", "XL", "L"],
    colors: ["Red", "Blue"],
    images: [
      "/white-t-shirt-portrait.png",
      "/folded-white-tshirt.png",
      "/tshirt-label-closeup.png",
      "/cotton-fabric-closeup.png",
    ],
    category: "design",
  },
  {
    slug: "boys-tshirt-3",
    name: "Boy’s t-shirt",
    sizes: ["XXL", "XL", "L"],
    colors: ["Red", "Blue"],
    images: [
      "/placeholder-hy5lj.png",
      "/placeholder.svg?height=900&width=900",
      "/placeholder.svg?height=900&width=900",
      "/placeholder.svg?height=900&width=900",
    ],
    category: "ready",
    quantity: 120,
  },
  {
    slug: "boys-tshirt-4",
    name: "Boy’s t-shirt",
    sizes: ["XXL", "XL", "L"],
    colors: ["Red", "Blue"],
    images: [
      "/placeholder.svg?height=900&width=900",
      "/placeholder.svg?height=900&width=900",
      "/placeholder.svg?height=900&width=900",
      "/placeholder.svg?height=900&width=900",
    ],
    category: "ready",
    quantity: 80,
  },
  // More sample products
  ...Array.from({ length: 12 }).map((_, i) => ({
    slug: `boys-tshirt-${i + 5}`,
    name: "Boy’s t-shirt",
    sizes: ["XXL", "XL", "L"],
    colors: ["Red", "Blue"],
    images: [
      "/placeholder.svg?height=900&width=900",
      "/white-t-shirt-detail.png",
      "/folded-white-tshirt.png",
      "/placeholder.svg?height=900&width=900",
    ],
    category: (i % 2 === 0 ? "design" : "ready") as "design" | "ready",
    quantity: 60 + (i % 5) * 10,
  })),
]
