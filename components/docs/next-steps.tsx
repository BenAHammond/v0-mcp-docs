import Link from "next/link"
import { ArrowRight } from "lucide-react"

const links = [
  { href: "/getting-started", label: "Install", description: "Cursor and Claude Code config; run from source." },
  { href: "/api-reference", label: "API reference", description: "Tools, parameters, and response shapes." },
  { href: "/samples", label: "Samples", description: "Prompt-to-component examples." },
]

export function NextSteps() {
  return (
    <section id="next-steps" aria-labelledby="next-steps-heading" className="py-10">
      <h2 id="next-steps-heading" className="text-xl font-semibold tracking-tight text-foreground mb-6">
        Next steps
      </h2>

      <ul role="list" className="flex flex-col gap-3 mb-10">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-start gap-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors p-4"
            >
              <ArrowRight
                className="size-4 text-muted-foreground group-hover:text-primary mt-0.5 shrink-0 transition-colors"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {link.description}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="flex items-center gap-3 pt-6 border-t border-border">
        <span className="text-xs text-muted-foreground">MIT License.</span>
        <span className="text-muted-foreground text-xs" aria-hidden="true">·</span>
        <a
          href="https://github.com/BenAHammond/v0-mcp-server"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          GitHub
        </a>
      </footer>
    </section>
  )
}
