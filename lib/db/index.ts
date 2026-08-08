import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "./schema"

const databaseUrl = process.env.DATABASE_URL ?? ""
const isPlaceholder = databaseUrl.includes("[")

// During build time without a real Supabase connection, use a no-op client
const client = isPlaceholder
  ? postgres("postgresql://localhost/build", { max: 0 })
  : postgres(databaseUrl)

export const db = drizzle(client, { schema })
