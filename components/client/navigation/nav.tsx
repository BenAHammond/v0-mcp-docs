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
  { pts: [[2, 7.5], [5, 1.5], [9, 7.5], [12.5, 2], [16, 7.5], [19.5, 1.5], [22, 6]], amp: 1.2, speed: 1.6, phase: 0.0, k: 0.5 },
  { pts: [[2, 13.5], [5, 9], [8.5, 13.5], [11.5, 9], [15, 13.5], [18, 9.5], [20.5, 13], [22, 10.5]], amp: 1.0, speed: 1.6, phase: 1.2, k: 0.6 },
  { pts: [[2, 17.5], [6, 22], [10, 17], [14.5, 16.5], [18, 22.5], [21, 17]], amp: 1.3, speed: 1.6, phase: 2.5, k: 0.4 },
]

const pointsAttr = (pts: Point[]) => pts.map(([x, y]) => `${x},${y}`).join(" ")

/** Rainbow hues, red → violet. */
const RAINBOW = ["#ff4d4d", "#ff9f1a", "#ffe14d", "#4ddb5e", "#4dc3ff", "#7d6bff", "#d24dff"]

/**
 * Brand mark: jagged zig-zag lines that slowly morph — a traveling wave passes
 * along each line, so the peaks and valleys drift. Each line carries its own
 * rainbow gradient, independently oriented and hue-rotated on load.
 */
function BrandMark() {
  const refs = useRef<(SVGPolylineElement | null)[]>([])
  const gradientRefs = useRef<(SVGLinearGradientElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // Give each line its own rainbow: a random orientation and a random
    // starting hue, so the distribution differs per line.
    gradientRefs.current.forEach((g) => {
      if (!g) return
      const angle = Math.random() * Math.PI * 2
      const c = 12
      const r = 17
      g.setAttribute("x1", (c - r * Math.cos(angle)).toFixed(2))
      g.setAttribute("y1", (c - r * Math.sin(angle)).toFixed(2))
      g.setAttribute("x2", (c + r * Math.cos(angle)).toFixed(2))
      g.setAttribute("y2", (c + r * Math.sin(angle)).toFixed(2))

      const rot = Math.floor(Math.random() * RAINBOW.length)
      Array.from(g.querySelectorAll("stop")).forEach((stop, j) => {
        stop.setAttribute("stop-color", RAINBOW[(j + rot) % RAINBOW.length])
      })
    })

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
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
      <defs>
        {LAYERS.map((_, i) => (
          <linearGradient
            key={i}
            id={`brand-rainbow-${i}`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="12"
            x2="24"
            y2="12"
            ref={(el) => {
              gradientRefs.current[i] = el
            }}
          >
            {RAINBOW.map((color, j) => (
              <stop key={j} offset={(j / (RAINBOW.length - 1)).toFixed(2)} stopColor={color} />
            ))}
          </linearGradient>
        ))}
      </defs>
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter">
        {LAYERS.map((layer, i) => (
          <polyline
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            stroke={`url(#brand-rainbow-${i})`}
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
