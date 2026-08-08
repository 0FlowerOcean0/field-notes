import { db } from "@/lib/db"
import { posts, snippets, tags, postTags } from "@/lib/db/schema"

export async function GET() {
  try {
    // Check if data already exists
    const existingPosts = await db.select().from(posts).execute()
    if (existingPosts.length > 0) {
      return Response.json({ message: "Database already seeded" })
    }

    // Seed tags
    const seedTags = ["工程", "系统", "性能", "工具", "Rust", "TypeScript", "Go"]
    const tagIds: number[] = []

    for (const tagName of seedTags) {
      const [newTag] = await db.insert(tags).values({ name: tagName }).returning()
      tagIds.push(newTag.id)
    }

    // Seed posts
    const seedPosts = [
      {
        title: "为什么我把整个博客重写成了 200 行代码",
        slug: "rewrite-blog-200-lines",
        excerpt:
          "一次关于「够用就好」的实验。删掉框架、删掉依赖，剩下的东西反而更耐用。",
        content: `三年前，我的博客跑在一套臃肿的技术栈上：一个后端、一个数据库、一套 CMS，外加十几个插件。每次想写点东西，光是让本地环境跑起来就要五分钟。于是我做了一个决定——推倒重来，只用最少的东西。

结果出乎意料：新版本总共不到 200 行代码，却比旧版跑得更快、更稳、也更让我愿意去写东西。这篇文章记录我是怎么一步步把它砍到这个程度的。

## 先删掉，再考虑加回来

我列了一张清单，把每一个依赖都问一遍：没有它我会死吗？答案大多是「不会」。评论系统、访问统计、标签云、相关文章推荐——这些东西加起来占了代码库的 80%，而我真正在乎的只有一件事：把文字清晰地呈现出来。

- 删掉数据库，文章直接用文件存储
- 删掉 CMS，用编辑器写纯文本
- 删掉客户端 JS 框架，回归服务端渲染
- 删掉分析脚本，我不需要知道谁在什么时候读了什么

每删掉一样东西，我都会等上一周，看看自己是不是真的想念它。三个月下来，没有任何一项让我后悔。

## 剩下的核心

最终，整个渲染逻辑塞进了一个文件里。核心思路简单到可以一眼看懂：读取内容，套上模板，返回 HTML。

\`\`\`typescript
function render(post: Post): string {
  const body = post.content
    .map(blockToHtml)
    .join("\\n")
  return layout({ title: post.title, body })
}
\`\`\`

内容用结构化的数据块表示，每一块只负责渲染自己。想加一种新的内容类型？在 \`blockToHtml\` 里加一个分支就行，不需要碰其它任何地方。

> 复杂度不会消失，它只会转移。而最好的转移方式，是把它转移到「不存在」。

## 一年后的回访

上线一年后，这套 200 行的东西没有出过一次故障，没有一个依赖需要升级，没有一个安全补丁需要打。它就在那里，安静地工作。

这大概就是「够用就好」最大的回报——你几乎会忘记它的存在。而当一个工具不再需要你操心时，你才真正拥有了它，而不是被它拥有。`,
        published: true,
        tagIndex: 0,
      },
      {
        title: "确定性构建：让 CI 不再玄学",
        slug: "deterministic-builds",
        excerpt:
          "锁定版本、固定时间戳、缓存哈希。一套让构建产物逐字节可复现的实践清单。",
        content: `「在我机器上是好的。」这句话背后，几乎总是构建过程中藏着未被锁定的变量。确定性构建的目标很纯粹：同样的输入，永远产出逐字节相同的输出。

听起来像强迫症，但它的实际收益非常具体：缓存能真正命中、二分定位问题变得可靠、供应链审计成为可能。

## 变量藏在哪里

- 未锁定的依赖版本
- 构建时嵌入的时间戳
- 文件系统遍历顺序
- 并发导致的输出顺序抖动

## 锁定依赖

\`\`\`bash
npm ci --frozen-lockfile
\`\`\`

## 锁定时间戳

\`\`\`bash
export SOURCE_DATE_EPOCH=$(git log -1 --pretty=%ct)
npm run build
\`\`\`

> 可复现构建的真正价值不在于强迫症式的整洁，而在于：当出问题时，你能精确地重放案发现场。`,
        published: true,
        tagIndex: 1,
      },
      {
        title: "边缘计算下的延迟预算",
        slug: "latency-budget-at-edge",
        excerpt:
          "把 5ms 拆成一个个可测量的片段，然后逐个消灭。",
        content: `当你的 P99 延迟目标是 5 毫秒时，每一微秒都要精打细算。

## 先测量，再优化

\`\`\`typescript
const t0 = performance.now()
const data = await store.read(key)
span.record("store.read", performance.now() - t0)
\`\`\`

## 预算分配

- 路由与解析：0.3ms
- 缓存查找：0.5ms
- 数据读取：2.0ms
- 序列化：1.2ms
- 网络回写：1.0ms

> 优化的第一定律：你没测量过的东西，就不要去优化它。`,
        published: true,
        tagIndex: 2,
      },
      {
        title: "我用了三年的终端配置",
        slug: "my-terminal-setup",
        excerpt:
          "从 shell 到编辑器，一份不追求花哨、只追求肌肉记忆的工具链记录。",
        content: `我的终端配置很无聊，而这正是我最满意的地方。

## 原则先于工具

- 能不装的插件就不装
- 配置纳入版本管理
- 快捷键宁少勿多

## 最常用的几个别名

\`\`\`bash
alias g="git"
alias gs="git status -sb"
alias gl="git log --oneline -20"
\`\`\`

> 工具应该消失在使用中。当你不再意识到它的存在，它才算真正好用。`,
        published: true,
        tagIndex: 3,
      },
    ]

    for (const postData of seedPosts) {
      const [newPost] = await db
        .insert(posts)
        .values({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content: postData.content,
          published: postData.published,
        })
        .returning()

      const postId = newPost.id
      await db
        .insert(postTags)
        .values({ postId, tagId: tagIds[postData.tagIndex] })
        .execute()
    }

    // Seed snippets
    const seedSnippets = [
      {
        title: "React Hook Pattern",
        code: `function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue] as const
}`,
        language: "typescript",
        description: "Persistent state with localStorage",
      },
      {
        title: "Debounce Function",
        code: `function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}`,
        language: "typescript",
        description: "Generic debounce utility",
      },
    ]

    for (const snippet of seedSnippets) {
      await db.insert(snippets).values(snippet).execute()
    }

    return Response.json({ message: "Database seeded successfully" })
  } catch (error) {
    console.error("Seed error:", error)
    return Response.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
