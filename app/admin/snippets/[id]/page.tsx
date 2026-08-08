"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

const LANGUAGES = [
  "typescript",
  "javascript",
  "rust",
  "go",
  "python",
  "bash",
  "html",
  "css",
  "json",
  "yaml",
  "sql",
]

export default function EditSnippetPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: "",
    code: "",
    language: "typescript",
    description: "",
  })

  useEffect(() => {
    fetch(`/api/snippets/${id}`)
      .then((res) => res.json())
      .then((snippet) => {
        setForm({
          title: snippet.title,
          code: snippet.code,
          language: snippet.language,
          description: snippet.description || "",
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/snippets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        router.push("/admin/snippets")
      }
    } catch (error) {
      console.error("Failed to update snippet:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="text-[#00ff00]/50 mb-4">$ vim snippet-{id}.txt</div>
        <div className="text-[#00ff00]/30">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-[#00ff00]/50 mb-6">$ vim snippet-{id}.txt</div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#ff6600] mb-1">title:</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#00ff00]/30 px-3 py-2 text-[#00ff00] text-sm focus:outline-none focus:border-[#00ff00]"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-[#ff6600] mb-1">language:</label>
          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#00ff00]/30 px-3 py-2 text-[#00ff00] text-sm focus:outline-none focus:border-[#00ff00]"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-[#0a0a0a]">
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[#ff6600] mb-1">
            description:
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#00ff00]/30 px-3 py-2 text-[#00ff00] text-sm focus:outline-none focus:border-[#00ff00]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#ff6600] mb-1">code:</label>
          <textarea
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#00ff00]/30 px-3 py-2 text-[#00ff00] text-sm font-mono focus:outline-none focus:border-[#00ff00] min-h-[200px]"
            required
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#00ff00]/20 border border-[#00ff00]/50 text-[#00ff00] text-sm hover:bg-[#00ff00]/30 transition-colors disabled:opacity-50"
          >
            {saving ? "$ saving..." : "$ :wq"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-[#00ff00]/20 text-[#00ff00]/70 text-sm hover:bg-[#00ff00]/5 transition-colors"
          >
            $ q!
          </button>
        </div>
      </form>
    </div>
  )
}
