import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { snippets } from "@/lib/db/schema"

export async function GET() {
  try {
    const allSnippets = await db.select().from(snippets).execute()
    return NextResponse.json(allSnippets)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, code, language, description } = body

    if (!title || !code) {
      return NextResponse.json(
        { error: "Title and code are required" },
        { status: 400 }
      )
    }

    const result = await db
      .insert(snippets)
      .values({
        title,
        code,
        language: language || "typescript",
        description: description || "",
      })
      .execute()

    return NextResponse.json(
      { id: result.lastInsertRowid, message: "Snippet created" },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 }
    )
  }
}
