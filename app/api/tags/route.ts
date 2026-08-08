import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { tags } from "@/lib/db/schema"

export async function GET() {
  try {
    const allTags = await db.select().from(tags).execute()
    return NextResponse.json(allTags)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const [newTag] = await db.insert(tags).values({ name }).returning()

    return NextResponse.json(
      { id: newTag.id, message: "Tag created" },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    )
  }
}
