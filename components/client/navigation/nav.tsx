"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const links = [
    { href: "/", label: "Home" },
    { href: "/getting-started", label: "Install" },
    { href: "/api-reference", label: "API" },
    { href: "/samples", label: "Samples" },
    { href: "https://github.com/BenAHammond/v0-mcp-server", label: "GitHub", external: true }
  ]

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground no-underline hover:text-primary transition-colors"
          >
            <span className="text-primary">v0</span>
            <span className="text-muted-foreground">MCP Server</span>
          </Link>

          <nav className="hidden sm:flex sm:items-center sm:gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="sm:hidden flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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

        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-border bg-card px-4 py-3">
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
