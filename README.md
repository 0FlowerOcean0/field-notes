<div align="center">

# 💻 田野笔记 / Field Notes

**终端美学技术博客 — Terminal Aesthetic Tech Blog**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-05F?logo=framer)](https://framer.com)
[![SQLite](https://img.shields.io/badge/SQLite-Drizzle-003B57?logo=sqlite)](https://orm.drizzle.team)

</div>

---

## 📖 项目简介

**FIELD.NOTES** 是一个采用终端/命令行界面美学设计的开发者博客。黑色背景搭配等宽字体、故障 (Glitch) 文字动画效果，营造出代码编辑器般的沉浸式阅读体验。

**FIELD.NOTES** is a developer blog designed with terminal/CLI aesthetics. Featuring a black background, monospace fonts, and glitch text animations, it creates an immersive code-editor-like reading experience.

## ✨ 功能特性

| 功能 | Feature |
|------|---------|
| 💻 终端美学界面 | Terminal aesthetic UI |
| 🔤 Geist Mono 等宽字体 | Geist Mono monospace font |
| ⚡ 故障文字动画 | Glitch text animation effects |
| 📝 文章系统 | Article system |
| 💡 代码片段 (Snippets) | Code snippets system |
| 🏷️ 标签系统 | Tag system |
| 📱 响应式设计 | Responsive design |
| 🗄️ SQLite 数据库 | SQLite + Drizzle ORM |
| ⚡ 管理后台 | Admin dashboard |

## 🛠️ 技术栈

- **框架**: Next.js 16 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS 4.x
- **动画**: Framer Motion
- **字体**: Geist Mono
- **数据库**: SQLite + Drizzle ORM
- **部署**: Vercel / 自托管

## 📂 项目结构

```
field-notes/
├── app/
│   ├── api/
│   │   ├── posts/         # 文章 API
│   │   ├── snippets/      # 代码片段 API
│   │   ├── tags/          # 标签 API
│   │   └── seed/          # 数据填充 API
│   ├── posts/             # 文章页
│   ├── snippets/          # 代码片段页
│   ├── about/             # 关于页
│   ├── admin/             # 管理后台
│   ├── layout.tsx
│   └── page.tsx           # 首页
├── components/
│   ├── GlitchText.tsx     # 故障文字效果
│   ├── TerminalCard.tsx   # 终端风格卡片
│   └── ...
├── lib/
│   ├── db.ts              # 数据库配置
│   └── schema.ts          # Drizzle Schema
├── public/                # 静态资源
└── drizzle/               # 数据库迁移
```

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 初始化数据库
npx drizzle-kit push

# 填充示例数据
curl http://localhost:3007/api/seed

# 启动开发服务器 (端口 3007)
npm run dev -- -p 3007
```

打开 [http://localhost:3007](http://localhost:3007) 查看效果。

## 📡 API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/posts` | GET/POST | 获取/创建文章 |
| `/api/snippets` | GET/POST | 获取/创建代码片段 |
| `/api/tags` | GET/POST | 获取/创建标签 |
| `/api/seed` | GET | 填充示例数据 |

## 📄 许可证

MIT License