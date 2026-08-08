"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import type { Block } from "@/lib/markdown"

// Post interface compatible with both hardcoded and DB-sourced posts
interface ArticlePost {
  id: string
  slug: string
  date: string
  title: string
  excerpt: string
  tag: string
  readTime: string
  content: Block[]
}

const ease = [0.22, 1, 0.36, 1] as const

// 把文本里用反引号包裹的片段渲染成行内代码样式
function renderInline(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code
          key={i}
          className="rounded-sm border border-foreground/20 bg-muted px-1.5 py-0.5 text-[0.85em] text-[#ea580c]"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-12 mb-4 flex items-center gap-3 border-l-4 border-[#ea580c] pl-3 text-lg font-mono font-bold tracking-tight text-balance">
          {block.text}
        </h2>
      )
    case "p":
      return (
        <p className="mb-5 text-sm lg:text-[15px] font-mono leading-relaxed text-foreground/90">
          {renderInline(block.text)}
        </p>
      )
    case "ul":
      return (
        <ul className="mb-6 flex flex-col gap-2">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm font-mono leading-relaxed text-foreground/90"
            >
              <span className="mt-[2px] shrink-0 text-[#ea580c]">{"—"}</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
    case "code":
      return (
        <div className="mb-6 border-2 border-foreground">
          <div className="flex items-center justify-between border-b border-foreground/30 bg-muted px-4 py-2">
            <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
              {block.lang}
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#ea580c]">
              {"// CODE"}
            </span>
          </div>
          <pre className="overflow-x-auto px-4 py-4">
            <code className="text-xs lg:text-[13px] font-mono leading-relaxed text-foreground">
              {block.code}
            </code>
          </pre>
        </div>
      )
    case "quote":
      return (
        <blockquote className="my-8 border-l-4 border-[#ea580c] bg-muted px-5 py-4">
          <p className="text-sm lg:text-[15px] font-mono italic leading-relaxed text-foreground">
            {renderInline(block.text)}
          </p>
        </blockquote>
      )
    default:
      return null
  }
}

export function ArticleBody({ post }: { post: ArticlePost }) {
  return (
    <article className="px-6 py-12 lg:px-4 lg:py-16">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <Link
          href="/#posts"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground transition-colors duration-200 hover:text-[#ea580c]"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          返回文章列表
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease }}
        className="mt-8 mb-10 border-b-2 border-foreground pb-8"
      >
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#ea580c]">
            {post.id}
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
            {post.date}
          </span>
          <span className="border border-foreground px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase font-mono">
            {post.tag}
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
            {post.readTime}
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-mono font-bold tracking-tight text-balance leading-snug">
          {post.title}
        </h1>
        <p className="mt-4 text-sm font-mono leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </motion.header>

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease }}
      >
        {post.content.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </motion.div>

      {/* Footer nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease }}
        className="mt-16 flex items-center justify-between border-t-2 border-foreground pt-8"
      >
        <Link
          href="/#posts"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground transition-colors duration-200 hover:text-[#ea580c]"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          全部文章
        </Link>
        <Link
          href="/#subscribe"
          className="bg-foreground text-background px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-mono transition-opacity duration-200 hover:opacity-90"
        >
          订阅更新
        </Link>
      </motion.div>
    </article>
  )
}
