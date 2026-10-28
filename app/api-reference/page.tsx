"use client"

import { useCallback, useState } from "react"
import { Search, Copy, Check, Sparkles, Boxes, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InlineCode } from "@/components/client/widgets/code-viewer"
import Link from "next/link"

interface Tool {
  name: string
  description: string
  icon: React.ReactNode
  parameters: {
    name: string
    type: string
    required: boolean
    description: string
  }[]
  example: string
  response: string
}

const TOOLS: Tool[] = [
  {
    name: "generate",
    description: "Prompt → UI. Returns chatId, webUrl, files (path + content). Optional chatId to iterate.",
    icon: <Sparkles className="h-5 w-5" />,
    parameters: [
      { name: "prompt", type: "string", required: true, description: "What to generate (e.g. \"A pricing table with 3 tiers\")" },
      { name: "chatId", type: "string", required: false, description: "Continue an existing chat instead of starting new" },
      { name: "projectId", type: "string", required: false, description: "Associate with a project" }
    ],
    example: `{
  "prompt": "Create a modern pricing table with 3 tiers: Basic, Pro, and Enterprise. Include feature lists and CTA buttons."
}`,
    response: `{
  "chatId": "chat_abc123",
  "webUrl": "https://v0.dev/chat/chat_abc123",
  "files": [
    { "path": "pricing-table.tsx", "content": "..." }
  ]
}`
  },
  {
    name: "request",
    description: "Generic {resource, action, params} dispatcher. Deploy, list/get/delete chats, versions, projects, env vars, reports.",
    icon: <Boxes className="h-5 w-5" />,
    parameters: [
      { name: "resource", type: "string", required: true, description: "The resource: chats, deployments, rate_limits, projects, env_vars, reports" },
      { name: "action", type: "string", required: true, description: "The operation on that resource (see search for the full list)" },
      { name: "params", type: "object", required: false, description: "Operation-specific parameters" }
    ],
    example: `{
  "resource": "deployments",
  "action": "create",
  "params": { "chatId": "chat_abc123" }
}`,
    response: `{
  "id": "deploy_xyz789",
  "url": "https://v0-pricing-table.vercel.app",
  "status": "ready"
}`
  },
  {
    name: "search",
    description: "On-demand manifest of every resource, action, and parameter. Ask it before invoking an unfamiliar request.",
    icon: <Search className="h-5 w-5" />,
    parameters: [],
    example: `{}`,
    response: `{
  "resources": {
    "chats":        { "actions": ["list", "get", "delete", "versions", "version", "init", "resolve_task"] },
    "deployments":  { "actions": ["create", "logs", "errors"] },
    "rate_limits":  { "actions": ["get"] },
    "projects":     { "actions": ["list", "create", "get", "update", "delete", "assign"] },
    "env_vars":     { "actions": ["list", "create", "update", "delete", "get"] },
    "reports":      { "actions": ["ai_usage", "usage", "user_activity"] }
  }
}`
  }
]

function QuickStart() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-baseline gap-3">
          <span className="font-mono text-xs text-brand">quick start</span>
          <h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">Quick Start</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-sm font-semibold">1. Get your API key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to <InlineCode>v0.dev/chat/settings/keys</InlineCode></li>
                <li>Click &quot;Generate New Key&quot;</li>
                <li>Copy your key</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-sm font-semibold">2. Configure your client</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-lg border border-[#33291e] bg-[#1f1811] p-4 font-mono text-xs leading-relaxed text-[#e7dcc7]">
{`# Set your API key
export V0_API_KEY="your-key"

# Run the MCP server
npx v0-mcp-server`}
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Link
            href="/getting-started"
            className="inline-flex items-center gap-2 font-mono text-sm text-primary underline-offset-4 hover:underline"
          >
            full setup guide <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Workflow() {
  const steps = [
    { step: "1", title: "Generate", desc: "Create a component", tool: "generate" },
    { step: "2", title: "Iterate", desc: "Refine with chatId", tool: "generate" },
    { step: "3", title: "Retrieve", desc: "Get the files", tool: "request {chats.get}" },
    { step: "4", title: "Deploy", desc: "Go live", tool: "request {deployments.create}" }
  ]

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-baseline gap-3">
          <span className="font-mono text-xs text-brand">workflow</span>
          <h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">Typical Workflow</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-4">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card font-mono text-sm font-semibold text-primary">
                {item.step}
              </div>
              <h3 className="font-mono text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mb-2 text-sm text-muted-foreground">{item.desc}</p>
              <code className="font-mono text-xs text-muted-foreground">{item.tool}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolCard({
  tool,
  expanded,
  copied,
  onToggle,
  onCopy
}: {
  tool: Tool
  expanded: boolean
  copied: boolean
  onToggle: (name: string) => void
  onCopy: (text: string, name: string) => void
}) {
  const handleToggle = useCallback(() => onToggle(tool.name), [onToggle, tool.name])
  const handleCopy = useCallback(() => onCopy(tool.example, tool.name), [onCopy, tool.example, tool.name])

  return (
    <Card id={tool.name} className={`overflow-hidden ${expanded ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="cursor-pointer" onClick={handleToggle}>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-primary">
            {tool.icon}
          </div>
          <div className="flex-1">
            <CardTitle className="font-mono text-lg font-semibold text-foreground">{tool.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-8 p-6 sm:p-8">
          {/* Parameters */}
          <div>
            <h3 className="mb-4 font-mono text-sm font-semibold text-foreground">parameters</h3>
            {tool.parameters.length === 0 ? (
              <p className="text-sm italic text-muted-foreground">No parameters required</p>
            ) : (
              <div className="space-y-3">
                {tool.parameters.map((param) => (
                  <div key={param.name} className="flex items-start gap-4 rounded-lg bg-muted p-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <code className="font-mono text-sm font-semibold text-foreground">{param.name}</code>
                        <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground">{param.type}</span>
                        {param.required ? (
                          <span className="rounded-full bg-destructive/10 px-2 py-0.5 font-mono text-xs text-destructive">required</span>
                        ) : (
                          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">optional</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{param.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Example */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-mono text-sm font-semibold text-foreground">request</h3>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-3 font-mono text-xs">
                  {copied ? (
                    <><Check className="mr-1 h-4 w-4 text-primary" /> copied</>
                  ) : (
                    <><Copy className="mr-1 h-4 w-4" /> copy</>
                  )}
                </Button>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-[#33291e] bg-[#1f1811] p-4 font-mono text-xs leading-relaxed text-[#e7dcc7]">
                <code>{tool.example}</code>
              </pre>
            </div>
            <div>
              <h3 className="mb-3 font-mono text-sm font-semibold text-foreground">response</h3>
              <pre className="overflow-x-auto rounded-lg border border-[#33291e] bg-[#1f1811] p-4 font-mono text-xs leading-relaxed text-[#e7dcc7]">
                <code>{tool.response}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default function ApiReferencePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedTool, setCopiedTool] = useState<string | null>(null)
  const [expandedTool, setExpandedTool] = useState<string | null>("generate")

  const copyToClipboard = useCallback((text: string, toolName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTool(toolName)
    setTimeout(() => setCopiedTool(null), 2000)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleToolToggle = useCallback((name: string) => {
    setExpandedTool((prev) => (prev === name ? null : name))
  }, [])

  const filteredTools = TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-brand">
            // api reference
          </p>
          <h1 className="mb-4 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
            API Reference
          </h1>
          <p className="mb-8 max-w-xl text-lg text-muted-foreground">
            Tools, parameters, and response shapes.
          </p>
          <div className="flex flex-wrap gap-3">
            {TOOLS.map((tool) => (
              <button
                key={tool.name}
                onClick={() => {
                  setExpandedTool(tool.name)
                  document.getElementById(tool.name)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 font-mono text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                {tool.icon}
                {tool.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="border-b border-border pb-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-11 w-full rounded-md pl-12 pr-4"
            />
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.name}
                tool={tool}
                expanded={expandedTool === tool.name}
                copied={copiedTool === tool.name}
                onToggle={handleToolToggle}
                onCopy={copyToClipboard}
              />
            ))}
          </div>
        </div>
      </section>

      <QuickStart />

      <Workflow />
    </div>
  )
}
