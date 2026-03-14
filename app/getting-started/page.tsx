import { CodeViewer } from "@/components/client/widgets/code-viewer"
import Link from "next/link"

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 sm:py-16 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Install</h1>
          <p className="text-gray-600">
            Node 18+. v0 API key from <a href="https://v0.dev/chat/settings/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">v0.dev/chat/settings/keys</a>. Any MCP client that supports stdio.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Cursor</h2>
            <p className="text-gray-600 text-sm mb-3">Add to <code className="bg-gray-100 px-1 rounded">~/.cursor/mcp.json</code> (or <code className="bg-gray-100 px-1 rounded">.cursor/mcp.json</code> in the project). Restart Cursor after editing.</p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Claude Code</h2>
            <p className="text-gray-600 text-sm mb-3">Add the server from the terminal. Replace <code className="bg-gray-100 px-1 rounded">your-api-key</code> with your v0 API key.</p>
            <CodeViewer
              language="bash"
              showLineNumbers={false}
              code={`claude mcp add v0 -e V0_API_KEY=your-api-key -- npx -y v0-mcp-server`}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Run directly</h2>
            <p className="text-gray-600 text-sm mb-3">Stdio. Pass <code className="bg-gray-100 px-1 rounded">V0_API_KEY</code> in the environment.</p>
            <CodeViewer language="bash" code={`V0_API_KEY=your-key npx v0-mcp-server`} showLineNumbers={false} />
            <p className="text-sm text-gray-500 mt-2">Or: <code className="bg-gray-100 px-1 rounded">npm install -g v0-mcp-server</code> then run <code className="bg-gray-100 px-1 rounded">v0-mcp-server</code> with the env set.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">From source</h2>
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

          <p className="text-sm text-gray-500 pt-4">
            <Link href="/api-reference" className="text-primary hover:underline">API reference</Link>
            {" · "}
            <a href="https://github.com/BenAHammond/v0-mcp-server" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>
          </p>
        </div>
      </section>
    </div>
  )
}
