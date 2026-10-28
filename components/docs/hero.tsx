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
      className="flex items-center gap-1.5 font-mono text-xs text-[#9c8f78] transition-colors hover:text-[#e7dcc7] cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="size-3.5" aria-hidden="true" />
          <span>copied</span>
        </>
      ) : (
        <>
          <Copy className="size-3.5" aria-hidden="true" />
          <span>copy</span>
        </>
      )}
    </button>
  )
}

interface CodeBlockProps {
  label: string
  code: string
}

function CodeBlock({ label, code }: CodeBlockProps) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-lg border border-[#33291e] bg-[#1f1811] text-sm">
      <figcaption className="flex items-center justify-between border-b border-[#33291e] bg-[#2a2118] px-4 py-2">
        <span className="font-mono text-xs lowercase text-[#9c8f78]">{label}</span>
        <CopyButton text={code} />
      </figcaption>
      <pre className="overflow-x-auto p-4 leading-relaxed">
        <code className="font-mono text-xs text-[#e7dcc7]">{code}</code>
      </pre>
    </figure>
  )
}

export function Hero() {
  return (
    <section className="pt-12 pb-14 sm:pt-16 sm:pb-16">
      <div className="mb-8 max-w-2xl">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-brand">
          // mcp server &middot; stdio &middot; 3 tools
        </p>
        <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-foreground text-balance sm:text-5xl lg:text-[3.4rem]">
          Generate UI from the tools you already use.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          v0&apos;s model behind an MCP server. Prompt a component, iterate a chat,
          deploy to production — over stdio, in any MCP client.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
        <CodeBlock label="cursor · ~/.cursor/mcp.json" code={cursorConfig} />
        <CodeBlock label="claude code" code={claudeCommand} />
      </div>

      <footer className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <p className="text-sm text-muted-foreground">
          API key from{" "}
          <a
            href="https://v0.dev/chat/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            v0.dev/chat/settings/keys
          </a>
        </p>
        <span className="hidden text-muted-foreground/60 sm:inline" aria-hidden="true">·</span>
        <nav aria-label="Quick links" className="flex items-center gap-5">
          <Link
            href="/getting-started"
            className="font-mono text-sm text-primary underline-offset-4 hover:underline"
          >
            install →
          </Link>
          <Link
            href="/api-reference"
            className="font-mono text-sm text-primary underline-offset-4 hover:underline"
          >
            api →
          </Link>
        </nav>
      </footer>
    </section>
  )
}
