import { SamplesGallery } from "@/components/sections/examples-gallery"
import Link from "next/link"

export default function SamplesPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-10 sm:py-12 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Samples</h1>
          <p className="text-gray-600 text-sm">
            Prompt → component examples. <Link href="/api-reference" className="text-primary hover:underline">API reference</Link>. <a href="https://github.com/BenAHammond/v0-mcp-server/tree/main/samples" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Examples on GitHub</a>.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SamplesGallery />
        </div>
      </section>
    </div>
  )
}