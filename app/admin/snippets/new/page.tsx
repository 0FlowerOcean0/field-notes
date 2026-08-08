"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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

export default function NewSnippetPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: "",
    code: "",
    language: "typescript",
    description: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        router.push("/admin/snippets")
      }
    } catch (error) {
      console.error("Failed to create snippet:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="text-[#00ff00]/50 mb-6">$ vim new-snippet.txt</div>

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
