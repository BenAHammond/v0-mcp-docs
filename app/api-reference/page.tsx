"use client"

import { useState } from "react"
import { Search, Copy, Check, Sparkles, Boxes, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CodeViewer, InlineCode } from "@/components/client/widgets/code-viewer"
import Link from "next/link"

interface Tool {
  name: string
  description: string
  icon: React.ReactNode
  color: string
  parameters: {
    name: string
    type: string
    required: boolean
    description: string
  }[]
  example: string
  response: string
}

export default function ApiReferencePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedTool, setCopiedTool] = useState<string | null>(null)
  const [expandedTool, setExpandedTool] = useState<string | null>("generate")

  const copyToClipboard = (text: string, toolName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTool(toolName)
    setTimeout(() => setCopiedTool(null), 2000)
  }

  const tools: Tool[] = [
    {
      name: "generate",
      description: "Prompt → UI. Returns chatId, webUrl, files (path + content). Optional chatId to iterate.",
      icon: <Sparkles className="h-5 w-5" />,
      color: "from-violet-500 to-purple-600",
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
      description: "Generic {resource, action, params} dispatcher. Deploy, list/get/delete chats, versions, projects, env vars, reports — all reachable here.",
      icon: <Boxes className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-600",
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
      color: "from-emerald-500 to-teal-600",
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

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 via-blue-50/30 to-emerald-50/50" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
              API Reference
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
              Tools, parameters, and response shapes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {tools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => {
                    setExpandedTool(tool.name)
                    document.getElementById(tool.name)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${tool.color} hover:shadow-lg hover:scale-105 transition-all`}
                >
                  {tool.icon}
                  {tool.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full rounded-full border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {filteredTools.map((tool) => (
              <Card
                key={tool.name}
                id={tool.name}
                className={`overflow-hidden border-0 shadow-lg transition-all ${expandedTool === tool.name ? 'ring-2 ring-violet-500 ring-offset-2' : ''}`}
              >
                <CardHeader
                  className={`bg-gradient-to-r ${tool.color} text-white cursor-pointer`}
                  onClick={() => setExpandedTool(expandedTool === tool.name ? null : tool.name)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl sm:text-2xl font-mono">{tool.name}</CardTitle>
                      <CardDescription className="text-white/80 mt-1">{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {expandedTool === tool.name && (
                  <CardContent className="p-6 sm:p-8 space-y-8 bg-white">
                    {/* Parameters */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Parameters</h3>
                      {tool.parameters.length === 0 ? (
                        <p className="text-gray-500 italic">No parameters required</p>
                      ) : (
                        <div className="space-y-3">
                          {tool.parameters.map((param) => (
                            <div key={param.name} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <code className="text-sm font-mono font-semibold text-gray-900">{param.name}</code>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">{param.type}</span>
                                  {param.required ? (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">required</span>
                                  ) : (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">optional</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{param.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Example */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Request</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(tool.example, tool.name)}
                            className="h-8 px-3"
                          >
                            {copiedTool === tool.name ? (
                              <><Check className="h-4 w-4 text-green-600 mr-1" /> Copied</>
                            ) : (
                              <><Copy className="h-4 w-4 mr-1" /> Copy</>
                            )}
                          </Button>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                          <pre className="text-sm text-gray-300">
                            <code>{tool.example}</code>
                          </pre>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Response</h3>
                        <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                          <pre className="text-sm text-emerald-400">
                            <code>{tool.response}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Quick Start</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>1. Get Your API Key</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Go to <InlineCode>v0.dev/chat/settings/keys</InlineCode></li>
                  <li>Click "Generate New Key"</li>
                  <li>Copy your key</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>2. Configure Claude</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeViewer 
                  language="bash"
                  showLineNumbers={false}
                  code={`# Set your API key
export V0_API_KEY="your-key"

# Run the MCP server
npx v0-mcp-server`}
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Full Setup Guide
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">Typical Workflow</h2>
          
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Generate", desc: "Create a component", tool: "generate", color: "violet" },
              { step: "2", title: "Iterate", desc: "Refine with chatId", tool: "generate", color: "blue" },
              { step: "3", title: "Retrieve", desc: "Get the files", tool: "request {chats.get}", color: "emerald" },
              { step: "4", title: "Deploy", desc: "Go live", tool: "request {deployments.create}", color: "pink" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-${item.color}-100 flex items-center justify-center text-${item.color}-600 font-bold text-xl`}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                <code className="text-xs font-mono text-gray-500">{item.tool}</code>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
