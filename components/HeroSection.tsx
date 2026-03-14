"use client"

import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 py-20 border-b border-border">
      <div className="max-w-2xl mx-auto w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          v0 MCP Server
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Connect v0 to your editor. Generate UI, manage chats, deploy—over stdio.
        </p>

        <div className="text-left space-y-4 mb-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Cursor — <code className="normal-case">~/.cursor/mcp.json</code></p>
            <pre className="bg-muted rounded-lg p-4 font-mono text-sm border border-border overflow-x-auto"><code>{`{
  "mcpServers": {
    "v0": {
      "command": "npx",
      "args": ["-y", "v0-mcp-server"],
      "env": { "V0_API_KEY": "your-key" }
    }
  }
}`}</code></pre>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Claude Code</p>
            <pre className="bg-muted rounded-lg p-4 font-mono text-sm border border-border overflow-x-auto"><code>claude mcp add v0 -e V0_API_KEY=your-key -- npx -y v0-mcp-server</code></pre>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          API key: <a href="https://v0.dev/chat/settings/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">v0.dev/chat/settings/keys</a>.{" "}
          <Link href="/getting-started" className="text-primary hover:underline">Install</Link>
          {" · "}
          <Link href="/api-reference" className="text-primary hover:underline">API reference</Link>
        </p>
      </div>
    </section>
  )
}
