import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core"

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").default(""),
  slug: text("slug").notNull().unique(),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const snippets = pgTable("snippets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  code: text("code").notNull(),
  language: text("language").notNull().default("typescript"),
  description: text("description").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
})

export const postTags = pgTable("post_tags", {
  postId: serial("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  tagId: serial("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
})
