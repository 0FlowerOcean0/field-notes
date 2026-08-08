"use client"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { motion } from "framer-motion"

const ease = [0.22, 1, 0.36, 1] as const

function BlinkDot() {
  return <span className="inline-block h-2 w-2 bg-[#ea580c] animate-blink" />
}

export function SubscribeSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section id="subscribe" className="w-full px-6 py-20 lg:px-12">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
          {"// SECTION: SUBSCRIBE"}
        </span>
        <div className="flex-1 border-t border-border" />
        <BlinkDot />
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">005</span>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease }}
        className="border-2 border-foreground"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            newsletter.sh
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            无广告 · 随时退订
          </span>
        </div>

        <div className="flex flex-col gap-8 px-5 py-8 lg:px-10 lg:py-12">
          <div className="flex flex-col gap-3 max-w-lg">
            <h2 className="text-2xl lg:text-3xl font-mono font-bold tracking-tight uppercase text-balance">
              每月一封，
              <span className="text-[#ea580c]">只发干货</span>
            </h2>
            <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed">
              新文章、正在读的书、以及一些还没成型的想法。不定期，但从不灌水。目前有 2,400+ 位读者。
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease }}
              className="flex items-center gap-3 border-2 border-foreground px-4 py-4 max-w-lg"
            >
              <span className="flex items-center justify-center w-6 h-6 bg-[#ea580c] shrink-0">
                <Check size={14} strokeWidth={2.5} className="text-background" />
              </span>
              <span className="text-xs lg:text-sm font-mono">
                {"已订阅 // 确认邮件已发送至 "}
                <span className="text-[#ea580c]">{email}</span>
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-lg">
              <label htmlFor="email" className="sr-only">
                邮箱地址
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 border-2 border-foreground bg-background px-4 py-3 text-xs lg:text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-secondary sm:border-r-0"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center justify-center gap-0 bg-foreground text-background text-xs font-mono tracking-wider uppercase shrink-0"
              >
                <span className="flex items-center justify-center w-10 h-full min-h-[44px] bg-[#ea580c]">
                  <ArrowRight size={16} strokeWidth={2} className="text-background" />
                </span>
                <span className="px-5 py-3">订阅</span>
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  )
}
