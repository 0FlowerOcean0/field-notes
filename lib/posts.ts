export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }

export interface Post {
  id: string
  slug: string
  date: string
  title: string
  excerpt: string
  tag: string
  readTime: string
  content: Block[]
}

export const POSTS: Post[] = [
  {
    id: "001",
    slug: "rewrite-blog-200-lines",
    date: "2026.06.28",
    title: "为什么我把整个博客重写成了 200 行代码",
    excerpt: "一次关于「够用就好」的实验。删掉框架、删掉依赖，剩下的东西反而更耐用。",
    tag: "工程",
    readTime: "8 分钟",
    content: [
      {
        type: "p",
        text: "三年前，我的博客跑在一套臃肿的技术栈上：一个后端、一个数据库、一套 CMS，外加十几个插件。每次想写点东西，光是让本地环境跑起来就要五分钟。于是我做了一个决定——推倒重来，只用最少的东西。",
      },
      {
        type: "p",
        text: "结果出乎意料：新版本总共不到 200 行代码，却比旧版跑得更快、更稳、也更让我愿意去写东西。这篇文章记录我是怎么一步步把它砍到这个程度的。",
      },
      { type: "h2", text: "先删掉，再考虑加回来" },
      {
        type: "p",
        text: "我列了一张清单，把每一个依赖都问一遍：没有它我会死吗？答案大多是「不会」。评论系统、访问统计、标签云、相关文章推荐——这些东西加起来占了代码库的 80%，而我真正在乎的只有一件事：把文字清晰地呈现出来。",
      },
      {
        type: "ul",
        items: [
          "删掉数据库，文章直接用文件存储",
          "删掉 CMS，用编辑器写纯文本",
          "删掉客户端 JS 框架，回归服务端渲染",
          "删掉分析脚本，我不需要知道谁在什么时候读了什么",
        ],
      },
      {
        type: "p",
        text: "每删掉一样东西，我都会等上一周，看看自己是不是真的想念它。三个月下来，没有任何一项让我后悔。",
      },
      { type: "h2", text: "剩下的核心" },
      {
        type: "p",
        text: "最终，整个渲染逻辑塞进了一个文件里。核心思路简单到可以一眼看懂：读取内容，套上模板，返回 HTML。",
      },
      {
        type: "code",
        lang: "typescript",
        code: `function render(post: Post): string {\n  const body = post.content\n    .map(blockToHtml)\n    .join("\\n")\n  return layout({ title: post.title, body })\n}`,
      },
      {
        type: "p",
        text: "内容用结构化的数据块表示，每一块只负责渲染自己。想加一种新的内容类型？在 `blockToHtml` 里加一个分支就行，不需要碰其它任何地方。这种「加法式」的扩展，比在庞大框架里找扩展点要愉快得多。",
      },
      {
        type: "quote",
        text: "复杂度不会消失，它只会转移。而最好的转移方式，是把它转移到「不存在」。",
      },
      { type: "h2", text: "一年后的回访" },
      {
        type: "p",
        text: "上线一年后，这套 200 行的东西没有出过一次故障，没有一个依赖需要升级，没有一个安全补丁需要打。它就在那里，安静地工作。",
      },
      {
        type: "p",
        text: "这大概就是「够用就好」最大的回报——你几乎会忘记它的存在。而当一个工具不再需要你操心时，你才真正拥有了它，而不是被它拥有。",
      },
    ],
  },
  {
    id: "002",
    slug: "deterministic-builds",
    date: "2026.06.14",
    title: "确定性构建：让 CI 不再玄学",
    excerpt: "锁定版本、固定时间戳、缓存哈希。一套让构建产物逐字节可复现的实践清单。",
    tag: "系统",
    readTime: "12 分钟",
    content: [
      {
        type: "p",
        text: "「在我机器上是好的。」这句话背后，几乎总是构建过程中藏着未被锁定的变量。确定性构建的目标很纯粹：同样的输入，永远产出逐字节相同的输出。",
      },
      {
        type: "p",
        text: "听起来像强迫症，但它的实际收益非常具体：缓存能真正命中、二分定位问题变得可靠、供应链审计成为可能。下面是我这几年攒下来的一份实践清单。",
      },
      { type: "h2", text: "变量藏在哪里" },
      {
        type: "ul",
        items: [
          "未锁定的依赖版本，`^1.2.0` 今天和明天可能不一样",
          "构建时嵌入的时间戳，让每次产物都不同",
          "文件系统遍历顺序，在不同机器上并不一致",
          "并发导致的输出顺序抖动",
          "绝对路径被写进产物，泄露了构建机器的目录结构",
        ],
      },
      { type: "h2", text: "锁定依赖" },
      {
        type: "p",
        text: "第一步永远是提交 lockfile，并在 CI 里用「只读」的方式安装。任何试图偷偷升级版本的行为都应该让构建直接失败，而不是悄悄放行。",
      },
      {
        type: "code",
        lang: "bash",
        code: `# 用 lockfile 精确安装，禁止自动更新\nnpm ci --frozen-lockfile`,
      },
      { type: "h2", text: "锁定时间戳" },
      {
        type: "p",
        text: "很多工具会在产物里嵌入当前时间。一个通用的解决办法是遵循 `SOURCE_DATE_EPOCH` 约定，把「现在」固定成一个可复现的值。",
      },
      {
        type: "code",
        lang: "bash",
        code: `export SOURCE_DATE_EPOCH=$(git log -1 --pretty=%ct)\nnpm run build`,
      },
      {
        type: "p",
        text: "把提交时间当作构建时间，既保证了可复现，又保留了有意义的时间信息。",
      },
      { type: "h2", text: "验证你的假设" },
      {
        type: "p",
        text: "别相信「我觉得它是确定的」。写一个脚本，连续构建两次，然后对比两份产物的哈希。只有哈希相同，才能算数。",
      },
      {
        type: "code",
        lang: "bash",
        code: `npm run build && sha256sum dist/* > a.txt\nnpm run build && sha256sum dist/* > b.txt\ndiff a.txt b.txt && echo "确定性构建 ✓"`,
      },
      {
        type: "quote",
        text: "可复现构建的真正价值不在于强迫症式的整洁，而在于：当出问题时，你能精确地重放案发现场。",
      },
      {
        type: "p",
        text: "当你的构建变得确定，缓存命中率会飙升，二分定位问题会变得轻松，供应链审计也成为可能。这是一项前期投入不小、但回报持续一生的基础设施投资。",
      },
    ],
  },
  {
    id: "003",
    slug: "latency-budget-at-edge",
    date: "2026.05.30",
    title: "边缘计算下的延迟预算",
    excerpt: "把 5ms 拆成一个个可测量的片段，然后逐个消灭。附带真实的火焰图分析。",
    tag: "性能",
    readTime: "10 分钟",
    content: [
      {
        type: "p",
        text: "当你的 P99 延迟目标是 5 毫秒时，每一微秒都要精打细算。延迟预算的做法，是先把这 5ms 拆解成一张明细表，再看每一项花了多少。",
      },
      { type: "h2", text: "先测量，再优化" },
      {
        type: "p",
        text: "在动手改任何一行代码之前，我会先在关键路径上埋点，得到一张真实的时间分布图。凭直觉优化，十有八九会优化错地方。",
      },
      {
        type: "code",
        lang: "typescript",
        code: `const t0 = performance.now()\nconst data = await store.read(key)\nspan.record("store.read", performance.now() - t0)`,
      },
      { type: "h2", text: "预算分配" },
      {
        type: "p",
        text: "把每一段耗时列出来之后，5ms 的去向一目了然。下面是某个真实接口的初始分布：",
      },
      {
        type: "ul",
        items: [
          "路由与解析：0.3ms",
          "缓存查找：0.5ms",
          "数据读取：2.0ms —— 最大的一块，也是优化重点",
          "序列化：1.2ms",
          "网络回写：1.0ms",
        ],
      },
      { type: "h2", text: "顺着火焰图往下挖" },
      {
        type: "p",
        text: "直觉告诉我瓶颈在数据读取，但火焰图给出了不同的答案：序列化意外地吃掉了近四分之一的预算，因为默认的 JSON 编码器在处理嵌套对象时反复分配了内存。",
      },
      {
        type: "code",
        lang: "typescript",
        code: `// 换成预编译的、零分配的编码器\nconst encode = compileSchema(ResponseSchema)\nreturn encode(data) // 1.2ms -> 0.3ms`,
      },
      {
        type: "quote",
        text: "优化的第一定律：你没测量过的东西，就不要去优化它。",
      },
      { type: "h2", text: "结果" },
      {
        type: "p",
        text: "换掉编码器后，P99 直接从 5.0ms 降到了 3.8ms，而我一行数据库代码都没动。有时候最大的收益，就藏在你最没在意的地方——前提是你得先去测量它。",
      },
    ],
  },
  {
    id: "004",
    slug: "my-terminal-setup",
    date: "2026.05.09",
    title: "我用了三年的终端配置",
    excerpt: "从 shell 到编辑器，一份不追求花哨、只追求肌肉记忆的工具链记录。",
    tag: "工具",
    readTime: "6 分钟",
    content: [
      {
        type: "p",
        text: "我的终端配置很无聊，而这正是我最满意的地方。它三年没怎么变过，因为一套稳定、可预测的工具，比任何花哨的插件都更能提升长期效率。",
      },
      { type: "h2", text: "原则先于工具" },
      {
        type: "ul",
        items: [
          "能不装的插件就不装，每个插件都是未来的维护负担",
          "配置纳入版本管理，一条命令就能在新机器上复原",
          "快捷键宁少勿多，只保留真正形成肌肉记忆的那几个",
          "任何配置都要能解释「为什么在这」，解释不了就删掉",
        ],
      },
      { type: "h2", text: "最常用的几个别名" },
      {
        type: "p",
        text: "别名的价值不在于省字符，而在于把高频动作压缩成一个不需要思考的动作。我只保留了自己每天都会用到的那几个。",
      },
      {
        type: "code",
        lang: "bash",
        code: `alias g="git"\nalias gs="git status -sb"\nalias gl="git log --oneline -20"\nalias ..="cd .."`,
      },
      { type: "h2", text: "一条命令复原一切" },
      {
        type: "p",
        text: "所有配置都放在一个 Git 仓库里，配一个极简的安装脚本。换新机器时，我不需要回忆「上次那个设置在哪」，只要跑一行命令，十秒后就是我熟悉的环境。",
      },
      {
        type: "code",
        lang: "bash",
        code: `git clone git@github.com:huahai/dotfiles.git ~/.dotfiles\n~/.dotfiles/install.sh`,
      },
      {
        type: "quote",
        text: "工具应该消失在使用中。当你不再意识到它的存在，它才算真正好用。",
      },
      {
        type: "p",
        text: "我不追求「最强配置」，只追求「不用再想」。把心智负担降到最低，剩下的注意力才能留给真正重要的事——手头正在解决的那个问题。",
      },
    ],
  },
]

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug)
}
