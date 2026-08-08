"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "~", title: "Dashboard" },
    { href: "/admin/posts", label: "$posts", title: "Posts" },
    { href: "/admin/snippets", label: "$snippets", title: "Snippets" },
    { href: "/admin/tags", label: "$tags", title: "Tags" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff00] font-mono">
      {/* Terminal Header */}
      <header className="border-b border-[#00ff00]/20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#00ff00]/50">field-notes@admin</span>
            <span className="text-[#00ff00]/30">:</span>
            <span className="text-[#ff6600]">~/admin</span>
            <span className="text-[#00ff00]/30">$</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <nav className="w-48 shrink-0">
            <div className="border border-[#00ff00]/20 p-4">
              <div className="text-[#00ff00]/50 text-xs mb-4">// NAVIGATION</div>
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href))
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block px-2 py-1 text-sm transition-colors ${
                          isActive
                            ? "bg-[#00ff00]/10 text-[#00ff00] border-l-2 border-[#00ff00]"
                            : "text-[#00ff00]/60 hover:text-[#00ff00] hover:bg-[#00ff00]/5"
                        }`}
                      >
                        <span className="text-[#ff6600]">{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-6 pt-4 border-t border-[#00ff00]/20">
                <Link
                  href="/"
                  className="block px-2 py-1 text-sm text-[#00ff00]/60 hover:text-[#00ff00] hover:bg-[#00ff00]/5"
                >
                  <span className="text-[#ff6600]">$exit</span>
                  <span className="ml-2">Back to Blog</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="border border-[#00ff00]/20 p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
