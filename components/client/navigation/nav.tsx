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
 * Brand mark: a sharp V with a black-and-white target at the vertex and a small
 * sparkle floating above.
 */
function BrandMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="12" y1="21.5" x2="4.5" y2="4.5" />
        <line x1="12" y1="21.5" x2="19.5" y2="4.5" />
      </g>
      <path d="M12 2.5 L12.9 4.3 L15 5.5 L12.9 6.7 L12 8.5 L11.1 6.7 L9 5.5 L11.1 4.3 Z" fill="currentColor" />
      <circle cx="12" cy="21.5" r="2.5" fill="#1d1610" />
      <circle cx="12" cy="21.5" r="1.2" fill="#ffffff" />
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
