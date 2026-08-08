import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { posts, postTags, tags } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { parseMarkdown, estimateReadTime } from "@/lib/markdown"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArticleBody } from "@/components/article-body"

async function getPostBySlug(slug: string) {
  const post = await db.select().from(posts).where(eq(posts.slug, slug)).get()
  if (!post) return null

  // Get associated tag names
  const postTagsList = await db
    .select({ tagId: postTags.tagId, tagName: tags.name })
    .from(postTags)
    .leftJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, post.id))
    .execute()

  return {
    ...post,
    tagNames: postTagsList.map((pt) => pt.tagName).filter(Boolean),
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: "文章未找到 — FIELD.NOTES" }
  return {
    title: `${post.title} — FIELD.NOTES`,
    description: post.excerpt,
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dbPost = await getPostBySlug(slug)
  if (!dbPost) notFound()

  const blocks = parseMarkdown(dbPost.content)
  const readTime = estimateReadTime(dbPost.content)

  // Map DB post to the format ArticleBody expects
  const post = {
    id: String(dbPost.id).padStart(3, "0"),
    slug: dbPost.slug,
    date: (() => {
      const d = new Date(dbPost.created_at)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      return `${y}.${m}.${day}`
    })(),
    title: dbPost.title,
    excerpt: dbPost.excerpt || "",
    tag: dbPost.tagNames.length > 0 ? dbPost.tagNames.join(" / ") : "未分类",
    readTime,
    content: blocks,
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl">
        <Navbar />
        <ArticleBody post={post} />
      </div>
      <Footer />
    </main>
  )
}