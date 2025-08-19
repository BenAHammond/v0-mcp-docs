"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  const [typedText, setTypedText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [showResult, setShowResult] = useState(false)

  const fullText = "use the v0 mcp server to generate a birthday party invite for Sarah's 25th birthday at Blue Moon Bar and deploy it to vercel"

  useEffect(() => {
    const typeText = async () => {
      for (let i = 0; i <= fullText.length; i++) {
        setTypedText(fullText.slice(0, i))
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
      setShowCursor(false)
      setTimeout(() => setShowResult(true), 500)
    }

    const timer = setTimeout(typeText, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex items-center justify-center px-4 py-16">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6">
            v0 MCP Server
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Take the pressure off your LLM Coder and let v0 handle the UI
          </p>
        </div>

        {/* Before/After Demo */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
          {/* Before - Terminal */}
          <div className="animate-fade-in-up">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Input</h3>
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
              <div className="bg-muted px-4 py-2 border-b border-border flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                <span className="text-sm text-muted-foreground ml-2">Terminal</span>
              </div>
              <div className="p-6 font-mono text-sm bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary">$</span>
                  <span className="text-foreground">
                    {typedText}
                    {showCursor && <span className="animate-blink">|</span>}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* After - Birthday Invitation */}
          <div
            className={`transition-all duration-1000 ${showResult ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
          >
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Output</h3>
            <div className="bg-gradient-to-br from-pink-500/90 via-purple-500/90 to-blue-500/90 dark:from-pink-600/90 dark:via-purple-600/90 dark:to-blue-600/90 rounded-lg p-8 shadow-lg border border-border relative overflow-hidden">
              {/* Confetti Background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-3 h-3 bg-pink-200 rounded-full animate-float"></div>
                <div className="absolute top-8 right-8 w-4 h-4 bg-blue-200 rounded-full animate-bounce-subtle"></div>
                <div
                  className="absolute bottom-12 left-8 w-3 h-3 bg-yellow-300 rounded-full animate-float"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-6 right-12 w-3 h-3 bg-green-300 rounded-full animate-bounce-subtle"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-200 rounded-full animate-float"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute top-1/3 right-1/3 w-2 h-2 bg-red-300 rounded-full animate-bounce-subtle"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>

              {/* Invitation Content */}
              <div className="relative z-10 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  You're Invited!
                </h2>
                <h3 className="text-xl font-semibold text-orange-500 mb-6">Sarah's Birthday Bash</h3>

                <div className="space-y-3 text-white/90 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">📅</span>
                    <span className="font-medium">Saturday, March 15th, 2025</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">⏰</span>
                    <span className="font-medium">7:00 PM - 11:00 PM</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">📍</span>
                    <span className="font-medium">Blue Moon Bar, Downtown</span>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-2 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
                  RSVP Now 🎈
                </Button>

                <p className="text-sm text-white/80 mt-4 font-medium">Can't wait to celebrate Sarah's 25th with you!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8">Quick Start</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Install and Run */}
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">Install and Run in a Single Line</h3>
              <div className="bg-muted rounded-md p-4 font-mono text-sm">
                <span className="text-muted-foreground">$</span> V0_API_KEY="your-key-here" npx v0-mcp-server
              </div>
            </div>

            {/* Add to Claude */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">Or add directly to Claude Code</h3>
              <p className="text-muted-foreground text-sm mb-3">The fastest way to get started - install directly into Claude</p>
              <div className="bg-card rounded-md p-4 font-mono text-sm">
                <span className="text-muted-foreground">$</span> claude mcp add v0-server -e V0_API_KEY="your-key-here" -- npx v0-mcp-server
              </div>
            </div>

            {/* Get API Key */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Need an API key? Get yours from{" "}
                <a href="https://v0.dev/chat/settings/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium underline">
                  v0.dev/chat/settings/keys
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}