"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Stats {
  posts: number
  snippets: number
  tags: number
  publishedPosts: number
  draftPosts: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [postsRes, snippetsRes, tagsRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/snippets"),
          fetch("/api/tags"),
        ])

        const posts = await postsRes.json()
        const snippets = await snippetsRes.json()
        const tags = await tagsRes.json()

        setStats({
          posts: posts.length,
          snippets: snippets.length,
          tags: tags.length,
          publishedPosts: posts.filter((p: { published: boolean }) => p.published).length,
          draftPosts: posts.filter((p: { published: boolean }) => !p.published).length,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="text-[#00ff00]/50 mb-4">$ cat /proc/stats</div>
        <div className="text-[#00ff00]/30">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-[#00ff00]/50 mb-6">$ cat /proc/stats</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatBox label="Total Posts" value={stats?.posts || 0} icon="📝" />
        <StatBox
          label="Published"
          value={stats?.publishedPosts || 0}
          icon="✅"
        />
        <StatBox label="Drafts" value={stats?.draftPosts || 0} icon="📄" />
        <StatBox label="Snippets" value={stats?.snippets || 0} icon="💻" />
      </div>

      <div className="border border-[#00ff00]/20 p-4 mb-6">
        <div className="text-[#00ff00]/50 mb-4">$ ls -la ./</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickLink
            href="/admin/posts"
            label="Manage Posts"
            command="$ vim posts/"
          />
          <QuickLink
            href="/admin/snippets"
            label="Manage Snippets"
            command="$ vim snippets/"
          />
          <QuickLink
            href="/admin/tags"
            label="Manage Tags"
            command="$ vim tags/"
          />
        </div>
      </div>

      <div className="border border-[#00ff00]/20 p-4">
        <div className="text-[#00ff00]/50 mb-2">$ echo $SYSTEM_INFO</div>
        <div className="text-xs space-y-1">
          <div>
            <span className="text-[#ff6600]">system:</span>{" "}
            <span className="text-[#00ff00]/70">FIELD.NOTES Admin Panel</span>
          </div>
          <div>
            <span className="text-[#ff6600]">version:</span>{" "}
            <span className="text-[#00ff00]/70">1.0.0</span>
          </div>
          <div>
            <span className="text-[#ff6600]">database:</span>{" "}
            <span className="text-[#00ff00]/70">SQLite + Drizzle ORM</span>
          </div>
          <div>
            <span className="text-[#ff6600]">status:</span>{" "}
            <span className="text-[#00ff00]">●</span>{" "}
            <span className="text-[#00ff00]/70">Operational</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: string
}) {
  return (
    <div className="border border-[#00ff00]/20 p-4">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-[#00ff00]">{value}</div>
      <div className="text-xs text-[#00ff00]/50">{label}</div>
    </div>
  )
}

function QuickLink({
  href,
  label,
  command,
}: {
  href: string
  label: string
  command: string
}) {
  return (
    <Link
      href={href}
      className="block border border-[#00ff00]/30 p-4 hover:bg-[#00ff00]/5 hover:border-[#00ff00]/50 transition-colors"
    >
      <div className="text-[#00ff00]/50 text-xs mb-1">{command}</div>
      <div className="text-[#00ff00]">{label}</div>
    </Link>
  )
}
