"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy } from "lucide-react"

const cursorConfig = `{
  "mcpServers": {
    "v0": {
      "command": "npx",
      "args": ["-y", "v0-mcp-server"],
      "env": {
        "V0_API_KEY": "your-key"
      }
    }
  }
}`

const claudeCommand = `claude mcp add v0 -e V0_API_KEY=your-key -- npx -y v0-mcp-server`

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="size-3.5" aria-hidden="true" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="size-3.5" aria-hidden="true" />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}

interface CodeBlockProps {
  label: string
  code: string
  lang?: string
}

function CodeBlock({ label, code, lang = "json" }: CodeBlockProps) {
  return (
    <figure className="flex flex-col gap-0 rounded-lg border border-border overflow-hidden text-sm">
      <figcaption className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <CopyButton text={code} />
      </figcaption>
      <pre className="bg-background overflow-x-auto p-4 leading-relaxed">
        <code className={`language-${lang} font-mono text-xs text-foreground`}>
          {code}
        </code>
      </pre>
    </figure>
  )
}

export function Hero() {
  return (
    <section className="border-b border-border pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance mb-3">
          v0 MCP Server
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
          Connect v0 to your editor. Generate UI, manage chats, deploy—over stdio.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <CodeBlock
          label="Cursor — ~/.cursor/mcp.json"
          code={cursorConfig}
          lang="json"
        />
        <CodeBlock
          label="Claude Code"
          code={claudeCommand}
          lang="bash"
        />
      </div>

      <footer className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-xs text-muted-foreground">
          API key:{" "}
          <a
            href="https://v0.dev/chat/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            v0.dev/chat/settings/keys
          </a>
        </p>
        <span className="text-muted-foreground text-xs hidden sm:inline" aria-hidden="true">·</span>
        <nav aria-label="Quick links" className="flex items-center gap-3">
          <Link href="/getting-started" className="text-xs text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">
            Install
          </Link>
          <span className="text-muted-foreground text-xs" aria-hidden="true">·</span>
          <Link href="/api-reference" className="text-xs text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">
            API reference
          </Link>
        </nav>
      </footer>
    </section>
  )
}
