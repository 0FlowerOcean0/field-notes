import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, tags, postTags } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const allPosts = await db.select().from(posts).execute()
    return NextResponse.json(allPosts)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, excerpt, slug, published, tagIds } = body

    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Title, content, and slug are required" },
        { status: 400 }
      )
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        content,
        excerpt: excerpt || "",
        slug,
        published: published || false,
      })
      .returning()

    const postId = newPost.id

    // Link tags if provided
    if (tagIds && Array.isArray(tagIds)) {
      for (const tagId of tagIds) {
        await db.insert(postTags).values({ postId, tagId }).execute()
      }
    }

    return NextResponse.json({ id: postId, message: "Post created" }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}
