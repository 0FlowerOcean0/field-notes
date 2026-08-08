import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { snippets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const snippetId = parseInt(id)

    const snippet = await db
      .select()
      .from(snippets)
      .where(eq(snippets.id, snippetId))
      .get()

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    return NextResponse.json(snippet)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch snippet" },
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
    const snippetId = parseInt(id)
    const body = await request.json()
    const { title, code, language, description } = body

    await db
      .update(snippets)
      .set({
        title,
        code,
        language,
        description,
      })
      .where(eq(snippets.id, snippetId))
      .execute()

    return NextResponse.json({ message: "Snippet updated" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update snippet" },
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
    const snippetId = parseInt(id)

    await db.delete(snippets).where(eq(snippets.id, snippetId)).execute()

    return NextResponse.json({ message: "Snippet deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete snippet" },
      { status: 500 }
    )
  }
}
