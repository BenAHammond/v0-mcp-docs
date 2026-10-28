const tools = [
  {
    n: "01",
    name: "generate",
    description: "Prompt → UI. Returns chatId, webUrl, and files (path + content). Pass chatId to iterate an existing chat.",
  },
  {
    n: "02",
    name: "request",
    description: "Generic {resource, action, params} dispatcher — deploy, chats, versions, projects, env vars, reports.",
  },
  {
    n: "03",
    name: "search",
    description: "On-demand manifest of every resource, action, and parameter. Ask before an unfamiliar request.",
  },
]

export function Overview() {
  return (
    <section id="overview" aria-labelledby="overview-heading" className="py-12 sm:py-16">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-mono text-xs text-brand">01</span>
        <h2 id="overview-heading" className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
          Three tools
        </h2>
      </div>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Three tools over MCP, spoken over stdio. Your editor or agent sends a tool
        name and arguments; the server returns structured responses.
      </p>

      <ul role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Available tools">
        {tools.map((tool) => (
          <li
            key={tool.name}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5"
          >
            <span className="flex items-baseline justify-between">
              <span className="font-mono text-sm font-semibold text-foreground">
                {tool.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground/70">{tool.n}</span>
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
