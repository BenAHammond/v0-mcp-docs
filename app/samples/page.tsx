import { SamplesGallery } from "@/components/sections/examples-gallery"
import Link from "next/link"

export default function SamplesPage() {
  return (
    <div className="min-h-screen">
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-brand">
            // samples
          </p>
          <h1 className="mb-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
            Samples
          </h1>
          <p className="text-sm text-muted-foreground">
            Prompt → component examples.{" "}
            <Link href="/api-reference" className="text-primary underline-offset-4 hover:underline">api reference →</Link>
            {" · "}
            <a href="https://github.com/BenAHammond/v0-mcp-server/tree/main/samples" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">
              examples on github ↗
            </a>
          </p>
        </div>
      </section>

      <section className="pb-10 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SamplesGallery />
        </div>
      </section>
    </div>
  )
}
