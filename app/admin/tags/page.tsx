"use client"

import { useEffect, useState } from "react"

interface Tag {
  id: number
  name: string
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [newTagName, setNewTagName] = useState("")
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")

  useEffect(() => {
    fetchTags()
  }, [])

  async function fetchTags() {
    try {
      const res = await fetch("/api/tags")
      const data = await res.json()
      setTags(data)
    } catch (error) {
      console.error("Failed to fetch tags:", error)
    } finally {
      setLoading(false)
    }
  }

  async function addTag() {
    if (!newTagName.trim()) return
    setAdding(true)

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim() }),
      })

      if (res.ok) {
        setNewTagName("")
        fetchTags()
      }
    } catch (error) {
      console.error("Failed to add tag:", error)
    } finally {
      setAdding(false)
    }
  }

  async function updateTag(id: number) {
    if (!editingName.trim()) return

    try {
      await fetch(`/api/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName.trim() }),
      })

      setEditingId(null)
      fetchTags()
    } catch (error) {
      console.error("Failed to update tag:", error)
    }
  }

  async function deleteTag(id: number) {
    if (!confirm("Delete this tag?")) return

    try {
      await fetch(`/api/tags/${id}`, { method: "DELETE" })
      setTags(tags.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Failed to delete tag:", error)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="text-[#00ff00]/50 mb-4">$ ls tags/</div>
        <div className="text-[#00ff00]/30">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-[#00ff00]/50 mb-6">$ ls tags/</div>

      {/* Add new tag */}
      <div className="border border-[#00ff00]/20 p-4 mb-6">
        <div className="text-[#00ff00]/50 text-xs mb-2">// Add new tag</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="tag name..."
            className="flex-1 bg-[#0a0a0a] border border-[#00ff00]/30 px-3 py-2 text-[#00ff00] text-sm focus:outline-none focus:border-[#00ff00]"
          />
          <button
            onClick={addTag}
            disabled={adding || !newTagName.trim()}
            className="px-4 py-2 bg-[#00ff00]/20 border border-[#00ff00]/50 text-[#00ff00] text-sm hover:bg-[#00ff00]/30 transition-colors disabled:opacity-50"
          >
            {adding ? "..." : "$ add"}
          </button>
        </div>
      </div>

      {/* Tags list */}
      {tags.length === 0 ? (
        <div className="text-[#00ff00]/50 text-center py-8">No tags found.</div>
      ) : (
        <div className="space-y-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="border border-[#00ff00]/20 p-4 flex items-center justify-between hover:bg-[#00ff00]/5 transition-colors"
            >
              {editingId === tag.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateTag(tag.id)
                      if (e.key === "Escape") setEditingId(null)
                    }}
                    className="flex-1 bg-[#0a0a0a] border border-[#00ff00]/30 px-3 py-1 text-[#00ff00] text-sm focus:outline-none focus:border-[#00ff00]"
                    autoFocus
                  />
                  <button
                    onClick={() => updateTag(tag.id)}
                    className="px-3 py-1 text-xs bg-[#00ff00]/20 text-[#00ff00] hover:bg-[#00ff00]/30"
                  >
                    save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 text-xs border border-[#00ff00]/20 text-[#00ff00]/70 hover:bg-[#00ff00]/5"
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00ff00]">#</span>
                    <span className="text-[#00ff00]/70">{tag.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(tag.id)
                        setEditingName(tag.name)
                      }}
                      className="px-3 py-1 text-xs border border-[#00ff00]/30 text-[#00ff00]/70 hover:bg-[#00ff00]/10 transition-colors"
                    >
                      rename
                    </button>
                    <button
                      onClick={() => deleteTag(tag.id)}
                      className="px-3 py-1 text-xs border border-red-500/30 text-red-500/70 hover:bg-red-500/10 transition-colors"
                    >
                      rm
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
