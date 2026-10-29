"use client"

import Link from "next/link"
import { useState } from "react"

const links = [
  { href: "/getting-started", label: "install" },
  { href: "/api-reference", label: "api" },
  { href: "/samples", label: "samples" },
]

const github = "https://github.com/BenAHammond/v0-mcp-server"

/**
 * Brand mark: a few jagged zig-zag lines with tall peaks and valleys — the
 * randomness is the point.
 */
function BrandMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter">
        <polyline points="2,8 5.5,1.5 9,8.5 12.5,1.5 16,8 20,2.5" />
        <polyline points="2,15.5 5.5,9.5 9,16 12.5,9 16,15.5 20,10" />
        <polyline points="3.5,22.5 7,16.5 11,22.5 14.5,16.5 18.5,22.5 21,17" />
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
