"use client"

import { motion } from "framer-motion"
import { Code, Terminal } from "lucide-react"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const ease = [0.22, 1, 0.36, 1] as const

interface Snippet {
  id: number
  title: string
  code: string
  language: string
  description: string
  created_at: string
}

const LANGUAGE_COLORS: Record<string, string> = {
  typescript: "#3178c6",
  javascript: "#f7df1e",
  python: "#3776ab",
  bash: "#4eaa25",
  go: "#00add8",
  rust: "#dea584",
  css: "#264de4",
  html: "#e34c26",
  sql: "#e38c00",
  text: "#666666",
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}.${m}.${day}`
}

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/snippets")
      .then((res) => res.json())
      .then((data) => setSnippets(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl">
        <Navbar />

        {/* Header */}
        <section className="px-6 pt-16 pb-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              {"// SNIPPETS"}
            </span>
            <h1 className="mt-4 text-3xl lg:text-4xl font-mono font-bold tracking-tight">
              <span className="text-[#ea580c]">&gt;</span> 代码片段
            </h1>
            <p className="mt-4 text-sm font-mono leading-relaxed text-muted-foreground max-w-xl">
              常用的代码片段、配置和命令。复制即用，不必再记。
            </p>
          </motion.div>
        </section>

        {/* Snippet list */}
        <section className="px-6 pb-20 lg:px-12">
          {loading ? (
            <div className="border-2 border-foreground p-8 text-sm font-mono text-muted-foreground">
              $ loading snippets...
            </div>
          ) : snippets.length === 0 ? (
            <div className="border-2 border-foreground p-8 text-sm font-mono text-muted-foreground">
              // No snippets yet. Seed the database:{" "}
              <code className="text-[#ea580c]">curl /api/seed</code>
            </div>
          ) : (
            <div className="space-y-4">
              {snippets.map((snippet, i) => {
                const langColor = LANGUAGE_COLORS[snippet.language.toLowerCase()] || "#666666"
                const isExpanded = expandedId === snippet.id

                return (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease }}
                    className="border-2 border-foreground transition-colors duration-200 hover:border-[#ea580c]"
                  >
                    {/* Snippet header */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : snippet.id)}
                      className="w-full px-5 py-4 flex items-center gap-4 text-left cursor-pointer group"
                    >
                      <Code
                        size={16}
                        strokeWidth={1.5}
                        className="shrink-0 text-muted-foreground group-hover:text-[#ea580c] transition-colors"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-mono font-bold truncate">
                            {snippet.title}
                          </h3>
                          <span
                            className="shrink-0 px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase font-mono border"
                            style={{ borderColor: langColor, color: langColor }}
                          >
                            {snippet.language}
                          </span>
                        </div>
                        {snippet.description && (
                          <p className="mt-1 text-xs font-mono text-muted-foreground truncate">
                            {snippet.description}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {formatDate(snippet.created_at)}
                      </span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-muted-foreground shrink-0"
                      >
                        v
                      </motion.span>
                    </button>

                    {/* Expanded code block */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.3, ease }}
                        className="border-t border-foreground/30"
                      >
                        <div className="flex items-center justify-between border-b border-foreground/30 bg-muted px-5 py-2">
                          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                            {snippet.language}
                          </span>
                          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#ea580c]">
                            {"// CODE"}
                          </span>
                        </div>
                        <pre className="overflow-x-auto px-5 py-4">
                          <code className="text-xs lg:text-[13px] font-mono leading-relaxed text-foreground whitespace-pre">
                            {snippet.code}
                          </code>
                        </pre>
                        <div className="border-t border-foreground/30 px-5 py-2 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(snippet.code)
                            }}
                            className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground hover:text-[#ea580c] transition-colors cursor-pointer"
                          >
                            $ cp to clipboard
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Footer link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="mt-8 flex justify-end"
          >
            <a
              href="/#posts"
              className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {"← 返回文章"}
            </a>
          </motion.div>
        </section>
      </div>

      <Footer />
    </main>
  )
}