const tools = [
  { name: "generate", description: "Create or continue a chat; returns chatId, webUrl, files (path + content)" },
  { name: "list_chats", description: "List chats (id, name, updatedAt). Pagination: limit, offset." },
  { name: "get_chat", description: "Get a chat by id; returns name, webUrl, files (path + content)." },
  { name: "delete_chat", description: "Delete a chat by id. Irreversible." },
  { name: "rate_limits", description: "Usage and quota (limit, remaining, resetAt)." },
  { name: "deploy", description: "Deploy a chat to a shareable URL. Returns deploy id, url, status." },
]

export function Overview() {
  return (
    <section id="overview" aria-labelledby="overview-heading" className="py-10 border-b border-border">
      <h2 id="overview-heading" className="text-xl font-semibold tracking-tight text-foreground mb-4">
        Overview
      </h2>

      <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
        Six tools over MCP (stdio). Your editor or agent sends a tool name and arguments; the server returns structured responses.
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-8">
        <code className="font-mono bg-muted text-foreground text-xs px-1.5 py-0.5 rounded border border-border">generate</code> creates or continues a chat and returns <code className="font-mono bg-muted text-foreground text-xs px-1 py-0.5 rounded border border-border">chatId</code>, <code className="font-mono bg-muted text-foreground text-xs px-1 py-0.5 rounded border border-border">webUrl</code>, and <code className="font-mono bg-muted text-foreground text-xs px-1 py-0.5 rounded border border-border">files</code> with full contents.{" "}
        <code className="font-mono bg-muted text-foreground text-xs px-1.5 py-0.5 rounded border border-border">list_chats</code>,{" "}
        <code className="font-mono bg-muted text-foreground text-xs px-1.5 py-0.5 rounded border border-border">get_chat</code>, and{" "}
        <code className="font-mono bg-muted text-foreground text-xs px-1.5 py-0.5 rounded border border-border">delete_chat</code> manage chats.{" "}
        <code className="font-mono bg-muted text-foreground text-xs px-1.5 py-0.5 rounded border border-border">rate_limits</code> reports quota.{" "}
        <code className="font-mono bg-muted text-foreground text-xs px-1.5 py-0.5 rounded border border-border">deploy</code> deploys a chat to a shareable URL.
      </p>

      <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" aria-label="Available tools">
        {tools.map((tool) => (
          <li
            key={tool.name}
            className="rounded-lg border border-border bg-background p-4 flex flex-col gap-1.5"
          >
            <span className="font-mono text-xs font-medium text-primary bg-muted px-2 py-0.5 rounded self-start border border-border">
              {tool.name}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tool.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
