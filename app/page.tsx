import { Hero } from "@/components/docs/hero"
import { Overview } from "@/components/docs/overview"
import { Example } from "@/components/docs/example"
import { NextSteps } from "@/components/docs/next-steps"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Hero />
        <Overview />
        <Example />
        <NextSteps />
      </div>
    </div>
  )
}
