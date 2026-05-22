'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const docLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/cookies', label: 'Cookie Policy' },
  { href: '/refunds', label: 'Refund Policy' },
  { href: '/contact', label: 'Contact Us' },
]

export function LegalLayout({
  children,
  title,
  lastUpdated,
}: {
  children: React.ReactNode
  title: string
  lastUpdated: string
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-violet-500/30 selection:text-white font-sans antialiased">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
        }}
        aria-hidden
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/20">
              <Zap className="w-4.5 h-4.5 text-white fill-white/10" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Intern<span className="text-violet-400">Hunt</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 md:py-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Nav */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              <p className="text-[10px] font-bold text-white/35 uppercase tracking-wider px-3 mb-3">Legal Documents</p>
              {docLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-violet-500/10 text-violet-400 border-l-2 border-violet-500"
                        : "text-white/45 hover:text-white/75 hover:bg-white/[0.02]"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </aside>

          {/* Document Content */}
          <main className="flex-1 max-w-3xl min-w-0">
            <article className="prose prose-invert max-w-none">
              <div className="mb-8 pb-6 border-b border-white/[0.08]">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">{title}</h1>
                <p className="text-xs text-white/40 font-mono">Last Updated: {lastUpdated}</p>
              </div>
              <div className="text-white/70 leading-relaxed text-sm space-y-6">
                {children}
              </div>
            </article>
          </main>
        </div>
      </div>

      {/* Simple Legal Footer */}
      <footer className="border-t border-white/[0.06] py-8 mt-20 relative z-10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © 2026 InternHunt. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/30">
            <a href="https://www.instagram.com/atul_sharmx_/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="https://github.com/AtulSharmx" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="mailto:support@internhunt.in" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
