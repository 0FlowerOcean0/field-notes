import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { BlogPosts } from "@/components/blog-posts"
import { AboutSection } from "@/components/about-section"
import { GlitchMarquee } from "@/components/glitch-marquee"
import { SubscribeSection } from "@/components/subscribe-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen dot-grid-bg">
      <Navbar />
      <main>
        <HeroSection />
        <BlogPosts />
        <AboutSection />
        <GlitchMarquee />
        <SubscribeSection />
      </main>
      <Footer />
    </div>
  )
}
