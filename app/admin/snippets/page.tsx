"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Snippet {
  id: number
  title: string
  language: string
  description: string
  createdAt: string
}

export default function AdminSnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSnippets()
  }, [])

  async function fetchSnippets() {
    try {
      const res = await fetch("/api/snippets")
      const data = await res.json()
      setSnippets(data)
    } catch (error) {
      console.error("Failed to fetch snippets:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteSnippet(id: number) {
    if (!confirm("Delete this snippet?")) return

    try {
      await fetch(`/api/snippets/${id}`, { method: "DELETE" })
      setSnippets(snippets.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Failed to delete snippet:", error)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="text-[#00ff00]/50 mb-4">$ ls snippets/</div>
        <div className="text-[#00ff00]/30">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-[#00ff00]/50">$ ls snippets/</div>
        <Link
          href="/admin/snippets/new"
          className="px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-sm hover:bg-[#00ff00]/20 transition-colors"
        >
          $ touch new-snippet.txt
        </Link>
      </div>

      {snippets.length === 0 ? (
        <div className="text-[#00ff00]/50 text-center py-8">
          No snippets found. Create your first snippet!
        </div>
      ) : (
        <div className="space-y-2">
          {snippets.map((snippet) => (
            <div
              key={snippet.id}
              className="border border-[#00ff00]/20 p-4 flex items-center justify-between hover:bg-[#00ff00]/5 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#00ff00] truncate">
                    {snippet.title}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-[#ff6600]/20 text-[#ff6600] border border-[#ff6600]/30">
                    {snippet.language}
                  </span>
                </div>
                <div className="text-xs text-[#00ff00]/50 truncate">
                  {snippet.description || "No description"}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/admin/snippets/${snippet.id}`}
                  className="px-3 py-1 text-xs border border-[#00ff00]/30 text-[#00ff00]/70 hover:bg-[#00ff00]/10 transition-colors"
                >
                  edit
                </Link>
                <button
                  onClick={() => deleteSnippet(snippet.id)}
                  className="px-3 py-1 text-xs border border-red-500/30 text-red-500/70 hover:bg-red-500/10 transition-colors"
                >
                  rm
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
