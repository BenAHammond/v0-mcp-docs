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

interface PanelProps {
  label: string
  code: string
  lang: string
}

function Panel({ label, code, lang }: PanelProps) {
  return (
    <figure className="flex flex-col flex-1 min-w-0 rounded-lg border border-border overflow-hidden text-sm">
      <figcaption className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border shrink-0">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <CopyButton text={code} />
      </figcaption>
      <pre className="bg-background overflow-x-auto overflow-y-auto p-4 leading-relaxed flex-1 max-h-80">
        <code className={`language-${lang} font-mono text-xs text-foreground whitespace-pre`}>
          {code}
        </code>
      </pre>
    </figure>
  )
}

export function Example() {
  return (
    <section id="api-reference" aria-labelledby="example-heading" className="py-10 border-b border-border">
      <h2 id="example-heading" className="text-xl font-semibold tracking-tight text-foreground mb-2">
        Example
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        Call <code className="font-mono bg-muted text-foreground text-xs px-1.5 py-0.5 rounded border border-border">generate</code> with
        a prompt. The response includes <code className="font-mono bg-muted text-foreground text-xs px-1 py-0.5 rounded border border-border">chatId</code>,{" "}
        <code className="font-mono bg-muted text-foreground text-xs px-1 py-0.5 rounded border border-border">webUrl</code>, and{" "}
        <code className="font-mono bg-muted text-foreground text-xs px-1 py-0.5 rounded border border-border">files</code> (path + content).
      </p>

      <div className="flex flex-col lg:flex-row gap-4">
        <Panel label="Request" code={requestJson} lang="json" />
        <Panel label="Response" code={responseSnippet} lang="tsx" />
      </div>
    </section>
  )
}
