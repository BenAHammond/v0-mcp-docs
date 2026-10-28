"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

const requestJson = `{
  "tool": "generate",
  "arguments": {
    "prompt": "A responsive card component with an avatar, name, role, and follow button."
  }
}`

const responseSnippet = `// components/profile-card.tsx
import { Avatar, AvatarImage, AvatarFallback }
  from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ProfileCardProps {
  name: string
  role: string
  avatarUrl?: string
}

export function ProfileCard({
  name,
  role,
  avatarUrl,
}: ProfileCardProps) {
  return (
    <div className="flex items-center justify-between
      rounded-xl border border-border bg-card p-4
      shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium
            text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">
            {role}
          </p>
        </div>
      </div>
      <Button size="sm" variant="outline">
        Follow
      </Button>
    </div>
  )
}`

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

interface PanelProps {
  label: string
  code: string
}

function Panel({ label, code }: PanelProps) {
  return (
    <figure className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#33291e] bg-[#1f1811] text-sm">
      <figcaption className="flex shrink-0 items-center justify-between border-b border-[#33291e] bg-[#2a2118] px-4 py-2">
        <span className="font-mono text-xs lowercase text-[#9c8f78]">{label}</span>
        <CopyButton text={code} />
      </figcaption>
      <pre className="flex-1 overflow-x-auto overflow-y-auto p-4 leading-relaxed max-h-80">
        <code className="whitespace-pre font-mono text-xs text-[#e7dcc7]">{code}</code>
      </pre>
    </figure>
  )
}

export function Example() {
  return (
    <section id="api-reference" aria-labelledby="example-heading" className="py-12 sm:py-16">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-mono text-xs text-brand">02</span>
        <h2 id="example-heading" className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
          Example
        </h2>
      </div>
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Call <code className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">generate</code>{" "}
        with a prompt. The response includes{" "}
        <code className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-xs text-foreground">chatId</code>,{" "}
        <code className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-xs text-foreground">webUrl</code>, and{" "}
        <code className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-xs text-foreground">files</code> (path + content).
      </p>

      <div className="flex flex-col gap-4 lg:flex-row">
        <Panel label="request" code={requestJson} />
        <Panel label="response" code={responseSnippet} />
      </div>
    </section>
  )
}
