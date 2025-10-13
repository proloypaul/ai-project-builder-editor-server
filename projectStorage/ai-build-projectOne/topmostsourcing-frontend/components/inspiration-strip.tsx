export function InspirationStrip() {
  // These images are included as references; they are not shown by default in the UI.
  // If you want to surface them on a page, import this component and render it.
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Desktop%20-%201-bpcpeGLRWbWpby18bC1qswghMT1MHM.png"
        alt="Homepage inspiration"
        className="rounded-lg border"
      />
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20Studio-FTdtslcZc5KibTFIBLQUTl4XMOv3Ox.png"
        alt="Design Studio inspiration"
        className="rounded-lg border"
      />
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Why%20Us-nTnfbBpPP7rPPJhHua4wxvGG1I7kzT.png"
        alt="Why Us inspiration"
        className="rounded-lg border"
      />
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Product%20Details-QEq2HG0kkU1bXZwn5rX4DqEBRVasZP.png"
        alt="Product Details inspiration"
        className="rounded-lg border"
      />
    </div>
  )
}
