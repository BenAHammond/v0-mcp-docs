import { Hero } from "@/components/docs/hero"
import { Overview } from "@/components/docs/overview"
import { Example } from "@/components/docs/example"
import { NextSteps } from "@/components/docs/next-steps"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Hero />
        <Overview />
        <Example />
        <NextSteps />
      </div>
    </div>
  )
}
