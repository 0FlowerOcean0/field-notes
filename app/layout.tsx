import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { GeistPixelGrid } from 'geist/font/pixel'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'FIELD.NOTES — 花海的个人博客 | 工程 · 系统 · 工具',
  description:
    '花海的个人博客。一名软件工程师记录关于系统设计、编程实践、性能优化和工具链的原始笔记。粗野主义排版，无广告，无算法推荐，只有可复现的经验。',
  keywords: [
    '个人博客',
    '软件工程师博客',
    '技术博客',
    '系统设计',
    '编程实践',
    '性能优化',
    '工具链',
    '分布式系统',
    'Rust',
    'TypeScript',
    'brutalist blog',
    'developer blog',
  ],
  authors: [{ name: '花海' }],
  creator: '花海',
  publisher: '花海',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    title: 'FIELD.NOTES — 花海的个人博客',
    description:
      '一名软件工程师记录关于系统设计、编程实践和工具链的原始笔记。粗野主义排版，无广告，只有可复现的经验。',
    siteName: 'FIELD.NOTES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIELD.NOTES — 花海的个人博客',
    description:
      '软件工程师的技术笔记：系统设计、性能优化、工具链。粗野主义排版，无广告，只有可复现的经验。',
    creator: '@huahai',
  },
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: '#F2F1EA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${GeistPixelGrid.variable}`} suppressHydrationWarning>
      <body className="font-mono antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
