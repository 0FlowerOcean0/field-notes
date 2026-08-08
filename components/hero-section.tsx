"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Typewriter } from "@/components/typewriter"

const ease = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  return (
    <section className="relative w-full px-6 pt-10 pb-16 lg:px-24 lg:pt-16 lg:pb-20">
      <div className="flex flex-col items-center text-center">
        {/* Status line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-3 border-2 border-foreground px-4 py-2 mb-8"
        >
          <span className="h-1.5 w-1.5 bg-[#ea580c] animate-blink" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            <Typewriter text="STATUS: 正在写作 · 坐标 上海" speed={45} />
          </span>
        </motion.div>

        {/* Name headline -- Geist Pixel Grid */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease }}
          className="font-pixel text-5xl sm:text-7xl lg:text-8xl tracking-tight text-foreground mb-6 select-none"
        >
          HUA HAI
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease }}
          className="text-xs lg:text-sm text-muted-foreground max-w-md mb-8 leading-relaxed font-mono"
        >
          软件工程师 / 独立开发者。在这里记录关于系统设计、编程实践和工具链的原始笔记。没有废话，只有可复现的经验。
        </motion.p>

        {/* CTA Button */}
        <motion.a
          href="#posts"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group flex items-center gap-0 bg-foreground text-background text-sm font-mono tracking-wider uppercase"
        >
          <span className="flex items-center justify-center w-10 h-10 bg-[#ea580c]">
            <motion.span
              className="inline-flex"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <ArrowRight size={16} strokeWidth={2} className="text-background" />
            </motion.span>
          </span>
          <span className="px-5 py-2.5">阅读文章</span>
        </motion.a>
      </div>
    </section>
  )
}
