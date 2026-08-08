"use client"

import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { estimateReadTime } from "@/lib/markdown"

interface DbPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  created_at: string
}

const ease = [0.22, 1, 0.36, 1] as const

const MotionLink = motion(Link)

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}.${m}.${day}`
}

function PostRow({ post, index }: { post: DbPost; index: number }) {
  return (
    <MotionLink
      href={`/posts/${post.slug}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.55, ease }}
      className="group relative flex flex-col gap-4 border-b-2 border-foreground px-5 py-6 last:border-b-0 lg:flex-row lg:items-center lg:gap-8 lg:px-8 lg:py-7 hover:bg-muted transition-colors duration-200 before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-[#ea580c] before:transition-all before:duration-200 hover:before:w-1"
    >
      {/* Meta */}
      <div className="flex items-center gap-4 lg:w-48 lg:shrink-0">
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#ea580c]">
          {String(post.id).padStart(3, "0")}
        </span>
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
          {formatDate(post.created_at)}
        </span>
      </div>

      {/* Title + excerpt */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-base lg:text-lg font-mono font-bold tracking-tight text-balance transition-colors duration-200 group-hover:text-[#ea580c]">
          {post.title}
        </h3>
        <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>
      </div>

      {/* Tag + read time + arrow */}
      <div className="flex items-center justify-between gap-4 lg:w-44 lg:shrink-0 lg:justify-end">
        <div className="flex flex-col items-start lg:items-end gap-1">
          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
            {estimateReadTime(post.content)}
          </span>
        </div>
        <ArrowUpRight
          size={20}
          strokeWidth={1.5}
          className="shrink-0 transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#ea580c]"
        />
      </div>
    </MotionLink>
  )
}

export function BlogPosts() {
  const [posts, setPosts] = useState<DbPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        // Only show published posts on the public page
        const published = Array.isArray(data)
          ? data.filter((p: DbPost) => p.published)
          : []
        setPosts(published)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="posts" className="w-full px-6 py-20 lg:px-12">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
          {"// SECTION: LATEST_POSTS"}
        </span>
        <div className="flex-1 border-t border-border" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">002</span>
      </motion.div>

      {/* Post list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease }}
        className="border-2 border-foreground"
      >
        {loading ? (
          <div className="px-8 py-8 text-sm font-mono text-muted-foreground">
            $ loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="px-8 py-8 text-sm font-mono text-muted-foreground">
            // No published posts yet. Seed the database first: <code className="text-[#ea580c]">curl /api/seed</code>
          </div>
        ) : (
          posts.map((post, i) => (
            <PostRow key={post.id} post={post} index={i} />
          ))
        )}
      </motion.div>

      {/* View all */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2, ease }}
        className="mt-6 flex justify-end"
      >
        <Link
          href="/snippets"
          className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          {"查看代码片段 →"}
        </Link>
      </motion.div>
    </section>
  )
}
