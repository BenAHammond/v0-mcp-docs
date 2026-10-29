"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const links = [
  { href: "/getting-started", label: "install" },
  { href: "/api-reference", label: "api" },
  { href: "/samples", label: "samples" },
]

const github = "https://github.com/BenAHammond/v0-mcp-server"

type Point = [number, number]
type Layer = {
  pts: Point[]
  amp: number
  speed: number
  phase: number
  k: number
}

/**
 * The three zig-zag lines as data — one source of truth for both the static
 * SSR render and the client-side morph animation.
 */
const LAYERS: Layer[] = [
  { pts: [[2, 7.5], [5, 1.5], [9, 7.5], [12.5, 2], [16, 7.5], [19.5, 1.5], [22, 6]], amp: 1.2, speed: 1.4, phase: 0.0, k: 0.5 },
  { pts: [[2, 11], [4.5, 9.5], [7, 11.5], [9.5, 9], [12, 11.5], [14.5, 9.5], [17, 11], [19.5, 9.5], [22, 11]], amp: 0.8, speed: 1.6, phase: 1.2, k: 0.6 },
  { pts: [[2, 17.5], [6, 22], [10, 17], [14.5, 16.5], [18, 22.5], [21, 17]], amp: 1.3, speed: 1.1, phase: 2.5, k: 0.4 },
]

const pointsAttr = (pts: Point[]) => pts.map(([x, y]) => `${x},${y}`).join(" ")

/**
 * Brand mark: jagged zig-zag lines that slowly morph — a traveling wave passes
 * along each line, so the peaks and valleys drift. The randomness is the point.
 */
function BrandMark() {
  const refs = useRef<(SVGPolylineElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = (now - start) / 1000
      LAYERS.forEach((layer, li) => {
        const el = refs.current[li]
        if (!el) return
        const pts = layer.pts.map(([x, y]) => {
          const dy = layer.amp * Math.sin(t * layer.speed + x * layer.k + layer.phase)
          return `${x},${(y + dy).toFixed(2)}`
        })
        el.setAttribute("points", pts.join(" "))
      })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter">
        {LAYERS.map((layer, i) => (
          <polyline
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            points={pointsAttr(layer.pts)}
          />
        ))}
      </g>
    </svg>
  )
}

export function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      {/* Harvest ribbon — a warm accent that shifts the whole chrome away from
          the default "flat card on card" look. */}
      <div
        className="h-[3px] bg-gradient-to-r from-brand via-[#a6734e] to-[#c69b6a]"
        aria-hidden="true"
      />

      <div className="border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 no-underline"
            aria-label="v0 MCP Server — home"
          >
            <BrandMark />
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
              v0<span className="text-muted-foreground">-mcp-server</span>
            </span>
            <span
              className="hidden h-[1.05em] w-[0.55em] animate-blink bg-primary sm:block"
              aria-hidden="true"
            />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 sm:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group font-mono text-sm lowercase text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="text-primary/60 transition-colors group-hover:text-primary">/</span>
                  {link.label}
                </Link>
              ))}
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm lowercase text-muted-foreground transition-colors hover:text-foreground"
              >
                github <span aria-hidden="true">↗</span>
              </a>
            </nav>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-border bg-background px-4 py-3 sm:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 font-mono text-sm lowercase text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-primary/60">/</span>
                  {link.label}
                </Link>
              ))}
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 font-mono text-sm lowercase text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                github <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
