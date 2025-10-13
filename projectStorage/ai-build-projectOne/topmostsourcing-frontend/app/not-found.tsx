import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-content-center text-center gap-3 p-8">
      <h1 className="text-3xl font-bold">Product not found</h1>
      <p className="text-muted-foreground">The item you are looking for doesn&apos;t exist or was moved.</p>
      <Button asChild variant="outline">
        <Link href="/design-studio">Back to Design Studio</Link>
      </Button>
    </div>
  )
}
