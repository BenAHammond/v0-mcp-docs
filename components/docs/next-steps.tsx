import Link from "next/link"

const links = [
  { href: "/getting-started", label: "install", description: "Cursor and Claude Code config; run from source." },
  { href: "/api-reference", label: "api reference", description: "Tools, parameters, and response shapes." },
  { href: "/samples", label: "samples", description: "Prompt-to-component examples." },
]

export function NextSteps() {
  return (
    <section id="next-steps" aria-labelledby="next-steps-heading" className="py-12 sm:py-16">
      <div className="mb-6 flex items-baseline gap-3">
        <span className="font-mono text-xs text-brand">03</span>
        <h2 id="next-steps-heading" className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
          Next steps
        </h2>
      </div>

      <ul role="list" className="mb-10 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
            >
              <span className="mt-0.5 shrink-0 font-mono text-sm text-primary transition-transform group-hover:translate-x-0.5">
                →
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-mono text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {link.label}
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">{link.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="flex items-center gap-3 border-t border-border pt-6">
        <span className="font-mono text-xs text-muted-foreground">MIT License.</span>
        <span className="text-xs text-muted-foreground" aria-hidden="true">·</span>
        <a
          href="https://github.com/BenAHammond/v0-mcp-server"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-primary underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          github ↗
        </a>
      </footer>
    </section>
  )
}
