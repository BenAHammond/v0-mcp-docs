import type React from "react"
import type { Metadata } from "next"
import { Source_Sans_3 } from "next/font/google"
import { Nav } from "@/components/client/navigation/nav"
import "./globals.css"

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "v0 MCP Server",
  description: "MCP server for v0: generate, request, search. Stdio. Any MCP client.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={sourceSans.className}>
        <Nav />
        {children}
      </body>
    </html>
  )
}