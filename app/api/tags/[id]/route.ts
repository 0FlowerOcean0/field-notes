import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { tags } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tagId = parseInt(id)

    const tag = await db.select().from(tags).where(eq(tags.id, tagId)).get()

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    return NextResponse.json(tag)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tag" },
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
    const tagId = parseInt(id)
    const body = await request.json()
    const { name } = body

    await db.update(tags).set({ name }).where(eq(tags.id, tagId)).execute()

    return NextResponse.json({ message: "Tag updated" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update tag" },
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
    const tagId = parseInt(id)

    await db.delete(tags).where(eq(tags.id, tagId)).execute()

    return NextResponse.json({ message: "Tag deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    )
  }
}
