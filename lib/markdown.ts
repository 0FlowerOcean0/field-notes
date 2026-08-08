/**
 * Minimal markdown-to-blocks parser.
 * Converts raw markdown text into structured Block elements
 * for the ArticleBody renderer.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }

export function parseMarkdown(raw: string): Block[] {
  const blocks: Block[] = []
  const lines = raw.split("\n")
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Empty line - skip
    if (trimmed === "") {
      i++
      continue
    }

    // Fenced code block: ```
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim() || "text"
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      blocks.push({ type: "code", lang, code: codeLines.join("\n") })
      continue
    }

    // Heading: ##
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3) })
      i++
      continue
    }

    // Blockquote: >
    if (trimmed.startsWith("> ")) {
      blocks.push({ type: "quote", text: trimmed.slice(2) })
      i++
      continue
    }

    // Unordered list: - or *
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items: string[] = []
      while (i < lines.length) {
        const lt = lines[i].trim()
        if (lt.startsWith("- ") || lt.startsWith("* ")) {
          items.push(lt.slice(2))
          i++
        } else if (lt === "") {
          break
        } else {
          break
        }
      }
      blocks.push({ type: "ul", items })
      continue
    }

    // Regular paragraph - collect consecutive non-empty, non-special lines
    const paraLines: string[] = []
    while (i < lines.length) {
      const lt = lines[i].trim()
      if (
        lt === "" ||
        lt.startsWith("## ") ||
        lt.startsWith("```") ||
        lt.startsWith("> ") ||
        lt.startsWith("- ") ||
        lt.startsWith("* ")
      ) {
        break
      }
      paraLines.push(lt)
      i++
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "p", text: paraLines.join(" ") })
    }
  }

  return blocks
}

/**
 * Estimate reading time for a markdown string (Chinese + code).
 */
export function estimateReadTime(raw: string): string {
  // Count Chinese chars and English words
  const chineseChars = (raw.match(/[一-鿿]/g) || []).length
  const englishWords = (
    raw.match(/[a-zA-Z]+/g) || []
  ).length
  // Rough: 300 Chinese chars/min, 200 English words/min
  const totalMinutes = Math.max(
    1,
    Math.ceil(chineseChars / 300 + englishWords / 200)
  )
  return `${totalMinutes} 分钟`
}