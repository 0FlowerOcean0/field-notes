"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

interface Tag {
  id: number
  name: string
}

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  tagIds: number[]
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [tags, setTags] = useState<Tag[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published: false,
    tagIds: [] as number[],
  })

  useEffect(() => {
    Promise.all([fetch(`/api/posts/${id}`).then((res) => res.json()), fetch("/api/tags").then((res) => res.json())])
      .then(([post, tagsData]) => {
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          published: post.published,
          tagIds: post.tagIds || [],
        })
        setTags(tagsData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        router.push("/admin/posts")
      }
    } catch (error) {
      console.error("Failed to update post:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="text-[#00ff00]/50 mb-4">$ vim post-{id}.md</div>
        <div className="text-[#00ff00]/30">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-[#00ff00]/50 mb-6">$ vim post-{id}.md</div>

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
          <label className="block text-xs text-[#ff6600] mb-1">slug:</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#00ff00]/30 px-3 py-2 text-[#00ff00] text-sm focus:outline-none focus:border-[#00ff00]"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-[#ff6600] mb-1">excerpt:</label>
          <input
            type="text"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#00ff00]/30 px-3 py-2 text-[#00ff00] text-sm focus:outline-none focus:border-[#00ff00]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#ff6600] mb-1">
            content (markdown):
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#00ff00]/30 px-3 py-2 text-[#00ff00] text-sm font-mono focus:outline-none focus:border-[#00ff00] min-h-[300px]"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-[#ff6600] mb-2">tags:</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center gap-1 px-2 py-1 border border-[#00ff00]/20 cursor-pointer hover:bg-[#00ff00]/10"
              >
                <input
                  type="checkbox"
                  checked={form.tagIds.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm({ ...form, tagIds: [...form.tagIds, tag.id] })
                    } else {
                      setForm({
                        ...form,
                        tagIds: form.tagIds.filter((tid) => tid !== tag.id),
                      })
                    }
                  }}
                  className="accent-[#00ff00]"
                />
                <span className="text-sm text-[#00ff00]/70">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({ ...form, published: e.target.checked })
              }
              className="accent-[#00ff00]"
            />
            <span className="text-sm text-[#00ff00]/70">published</span>
          </label>
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
