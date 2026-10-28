import { CodeViewer } from "@/components/client/widgets/code-viewer"
import Link from "next/link"

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen">
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-brand">
            // install
          </p>
          <h1 className="mb-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
            Install
          </h1>
          <p className="text-muted-foreground">
            Node 18+. A v0 API key from{" "}
            <a href="https://v0.dev/chat/settings/keys" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80">
              v0.dev/chat/settings/keys
            </a>
            . Any MCP client that supports stdio.
          </p>
        </div>
      </section>

      <section className="pb-10 sm:pb-12">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="mb-1 font-mono text-lg font-semibold text-foreground">cursor</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Add to <code className="rounded bg-muted px-1 font-mono">~/.cursor/mcp.json</code> (or{" "}
              <code className="rounded bg-muted px-1 font-mono">.cursor/mcp.json</code> in the project). Restart Cursor after editing.
            </p>
            <CodeViewer
              language="json"
              showLineNumbers={false}
              code={`{
  "mcpServers": {
    "v0": {
      "command": "npx",
      "args": ["-y", "v0-mcp-server"],
      "env": { "V0_API_KEY": "your-api-key" }
    }
  }
}`}
            />
          </div>

          <div>
            <h2 className="mb-1 font-mono text-lg font-semibold text-foreground">claude code</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Add the server from the terminal. Replace <code className="rounded bg-muted px-1 font-mono">your-api-key</code> with your v0 API key.
            </p>
            <CodeViewer
              language="bash"
              showLineNumbers={false}
              code={`claude mcp add v0 -e V0_API_KEY=your-api-key -- npx -y v0-mcp-server`}
            />
          </div>

          <div>
            <h2 className="mb-1 font-mono text-lg font-semibold text-foreground">run directly</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Stdio. Pass <code className="rounded bg-muted px-1 font-mono">V0_API_KEY</code> in the environment.
            </p>
            <CodeViewer language="bash" code={`V0_API_KEY=your-key npx v0-mcp-server`} showLineNumbers={false} />
            <p className="mt-2 text-sm text-muted-foreground">
              Or: <code className="rounded bg-muted px-1 font-mono">npm install -g v0-mcp-server</code> then run{" "}
              <code className="rounded bg-muted px-1 font-mono">v0-mcp-server</code> with the env set.
            </p>
          </div>

          <div>
            <h2 className="mb-1 font-mono text-lg font-semibold text-foreground">from source</h2>
            <CodeViewer
              language="bash"
              showLineNumbers={false}
              code={`git clone https://github.com/BenAHammond/v0-mcp-server.git
cd v0-mcp-server
pnpm install
pnpm build
V0_API_KEY=your-key node dist/index.js`}
            />
          </div>

          <p className="pt-4 font-mono text-sm text-muted-foreground">
            <Link href="/api-reference" className="text-primary underline-offset-4 hover:underline">api reference →</Link>
            {" · "}
            <a href="https://github.com/BenAHammond/v0-mcp-server" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">github ↗</a>
          </p>
        </div>
      </section>
    </div>
  )
}
