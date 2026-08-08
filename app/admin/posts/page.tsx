"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Post {
  id: number
  title: string
  slug: string
  published: boolean
  createdAt: string
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts")
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deletePost(id: number) {
    if (!confirm("Delete this post?")) return

    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" })
      setPosts(posts.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="text-[#00ff00]/50 mb-4">$ ls posts/</div>
        <div className="text-[#00ff00]/30">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-[#00ff00]/50">$ ls posts/</div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-sm hover:bg-[#00ff00]/20 transition-colors"
        >
          $ touch new-post.md
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-[#00ff00]/50 text-center py-8">
          No posts found. Create your first post!
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-[#00ff00]/20 p-4 flex items-center justify-between hover:bg-[#00ff00]/5 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      post.published ? "bg-[#00ff00]" : "bg-[#ff6600]"
                    }`}
                  />
                  <span className="text-[#00ff00] truncate">{post.title}</span>
                </div>
                <div className="text-xs text-[#00ff00]/50">
                  <span className="text-[#ff6600]">slug:</span> {post.slug} |{" "}
                  <span className="text-[#ff6600]">status:</span>{" "}
                  {post.published ? "published" : "draft"}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="px-3 py-1 text-xs border border-[#00ff00]/30 text-[#00ff00]/70 hover:bg-[#00ff00]/10 transition-colors"
                >
                  edit
                </Link>
                <button
                  onClick={() => deletePost(post.id)}
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
