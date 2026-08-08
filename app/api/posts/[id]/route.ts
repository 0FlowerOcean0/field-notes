import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, postTags } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = parseInt(id)

    const post = await db.select().from(posts).where(eq(posts.id, postId)).get()

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Get associated tags
    const postTagsList = await db
      .select({ tagId: postTags.tagId })
      .from(postTags)
      .where(eq(postTags.postId, postId))
      .execute()

    return NextResponse.json({ ...post, tagIds: postTagsList.map((pt) => pt.tagId) })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = parseInt(id)
    const body = await request.json()
    const { title, content, excerpt, slug, published, tagIds } = body

    await db
      .update(posts)
      .set({
        title,
        content,
        excerpt,
        slug,
        published,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(posts.id, postId))
      .execute()

    // Update tags
    if (tagIds && Array.isArray(tagIds)) {
      // Remove existing tags
      await db.delete(postTags).where(eq(postTags.postId, postId)).execute()
      // Add new tags
      for (const tagId of tagIds) {
        await db.insert(postTags).values({ postId, tagId }).execute()
      }
    }

    return NextResponse.json({ message: "Post updated" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = parseInt(id)

    await db.delete(postTags).where(eq(postTags.postId, postId)).execute()
    await db.delete(posts).where(eq(posts.id, postId)).execute()

    return NextResponse.json({ message: "Post deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}
