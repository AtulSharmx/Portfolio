'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import {
  ArrowRight, Zap, BrainCircuit, FileText,
  CheckCircle2, Star, Users, Timer, Menu, X, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

/* ─── animation helpers ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
})
const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
})


// Removed FEATURES constant as it is replaced by the workflow loop

const STEPS = [
  { n: '01', icon: Timer, t: 'Set up in 2 minutes', d: "Tell us your skills and target roles. No resume upload needed." },
  { n: '02', icon: Zap, t: 'Agent hunts every day', d: "Your AI agent runs on schedule, scans every major platform, filters noise ruthlessly." },
  { n: '03', icon: Star, t: 'Wake up to matches', d: "Top opportunities rank by match score. Cover letters ready to send. Every morning." },
]

// Removed Testimonials

const COLLEGES = ['IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'VIT', 'SRM', 'Manipal', 'IIIT Hyd', 'DTU']

/* ─── Ambient glow orbs ─── */
function GlowOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-3xl" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-rose-600/5 rounded-full blur-3xl" />
    </div>
  )
}

/* ─── Grid pattern ─── */
function GridPattern() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)`,
        backgroundSize: '56px 56px',
      }}
      aria-hidden
    />
  )
}

/* ─── Floating match card (for hero mock) ─── */
function MockMatchCard({
  id, company, role, score, stipend, delay = 0,
}: { id: string; company: string; role: string; score: number; stipend: string; delay?: number }) {
  const scoreColor = score >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : score >= 60 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-red-400 bg-red-500/10 border-red-500/20'

  const avatarColors = [
    'from-violet-500/30 to-purple-600/20 text-violet-300',
    'from-blue-500/30 to-indigo-600/20 text-blue-300',
    'from-emerald-500/30 to-green-600/20 text-emerald-300',
    'from-rose-500/30 to-pink-600/20 text-rose-300',
    'from-amber-500/30 to-orange-600/20 text-amber-300',
  ]
  const c = avatarColors[company.charCodeAt(0) % avatarColors.length]

  return (
    <Link href={`/match/${id}`} className="block">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.14] transition-colors cursor-pointer"
      >
        <div className={cn('w-9 h-9 rounded-lg bg-gradient-to-br border border-white/[0.08] flex items-center justify-center flex-shrink-0', c)}>
          <span className="text-xs font-bold">{company[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white truncate leading-snug">{role}</p>
          <p className="text-[11px] text-white/40">{company} · {stipend}</p>
        </div>
        <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0', scoreColor)}>
          {score}%
        </span>
      </motion.div>
    </Link>
  )
}

/* ─── NOT LOGGED IN: public marketing hero ─── */
function MarketingHero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative z-10 pt-8 pb-12 md:pt-14 md:pb-16 w-full px-5 sm:px-8">
      <GlowOrbs />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
        {/* Badge */}
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] mb-5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping-sm absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-sm text-white/55">AI-Powered Internship Matching</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-4xl sm:text-5xl md:text-[56px] lg:text-[68px] xl:text-[76px] font-bold tracking-[-0.03em] leading-[1.04] mb-5"
        >
          <span className="text-white">Your AI hunts</span><br />
          <span className="bg-gradient-to-r from-violet-300 via-violet-200 to-rose-300 bg-clip-text text-transparent">
            internships
          </span><br />
          <span className="text-white/85">while you sleep.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-base md:text-lg text-white/40 mb-8 max-w-xl leading-relaxed mx-auto text-center"
        >
          Set up once. Wake up to personalised matches, AI-crafted cover letters,
          and a clear path to your dream role — every single morning.
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(0.3)} className="flex justify-center">
          <Link href={isLoggedIn ? "/dashboard" : "/onboarding"}>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/92 px-14 h-16 text-lg font-bold rounded-full transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/15 group"
            >
              {isLoggedIn ? "Open Dashboard" : "Start Hunting"}
              <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}


/* ─── Main component ─── */
export default function LandingPage() {
  const { user, loading, isLoggedIn } = useUser()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const navBg = useTransform(scrollY, [0, 80], ['rgba(10,10,10,0)', 'rgba(10,10,10,0.9)'])

  useEffect(() => {
    const unsub = scrollY.on('change', v => setScrolled(v > 60))
    return unsub
  }, [scrollY])

  // Redirect logged in users to the app dashboard
  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.replace('/dashboard')
    }
  }, [isLoggedIn, loading, router])

  if (loading || isLoggedIn) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center">
        <Spinner size={24} />
      </div>
    )
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      <GridPattern />

      {/* ── NAV ── */}
      <motion.nav
        style={{ backgroundColor: navBg }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'border-b border-white/[0.06] backdrop-blur-xl' : ''
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
                <Zap className="w-5 h-5 text-white fill-white/10" strokeWidth={2.5} />
              </div>
              <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Intern<span className="text-violet-400">Hunt</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {!isLoggedIn && (
                <>
                  <Link href="#features" className="text-sm text-white/45 hover:text-white/85 transition-colors">Features</Link>
                  <Link href="#how-it-works" className="text-sm text-white/45 hover:text-white/85 transition-colors">How it works</Link>
                </>
              )}
              {isLoggedIn && (
                <>
                  <Link href="/dashboard" className="text-sm text-white/45 hover:text-white/85 transition-colors">Dashboard</Link>
                  <Link href="/tracker" className="text-sm text-white/45 hover:text-white/85 transition-colors">Tracker</Link>
                  <Link href="/insights" className="text-sm text-white/45 hover:text-white/85 transition-colors">Insights</Link>
                </>
              )}
            </div>

            {/* Desktop right CTA */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {/* Logged in: user avatar + dashboard */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500/50 to-purple-600/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-violet-200">{user!.name[0]}</span>
                    </div>
                    <span className="text-xs text-white/60 font-medium">{user!.name.split(' ')[0]}</span>
                  </div>
                  <Link href="/dashboard">
                    <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90 px-5 font-semibold">
                      Open dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-white/45 hover:text-white/80 transition-colors">Sign in</Link>
                  <Link href="/onboarding">
                    <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90 px-5 font-medium shadow-md">
                      Signup
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(m => !m)}
              className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-white/[0.06] mt-4 pt-4 pb-2 overflow-hidden"
              >
                <div className="space-y-1 mb-3">
                  {isLoggedIn ? (
                    <>
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-2 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors">Dashboard <ChevronRight className="w-4 h-4 opacity-40" /></Link>
                      <Link href="/tracker" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-2 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors">Tracker <ChevronRight className="w-4 h-4 opacity-40" /></Link>
                      <Link href="/insights" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-2 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors">Insights <ChevronRight className="w-4 h-4 opacity-40" /></Link>
                    </>
                  ) : (
                    <>
                      <Link href="#features" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-2 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors">Features <ChevronRight className="w-4 h-4 opacity-40" /></Link>
                      <Link href="#how-it-works" onClick={() => setMenuOpen(false)} className="flex items-center justify-between px-2 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors">How it works <ChevronRight className="w-4 h-4 opacity-40" /></Link>
                    </>
                  )}
                </div>
                <Link href={isLoggedIn ? '/dashboard' : '/onboarding'}>
                  <Button className="w-full rounded-full bg-white text-black hover:bg-white/90 font-semibold">
                    {isLoggedIn ? 'Open dashboard' : 'Signup'}
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <div className="pt-16">
        {loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <Spinner size={20} />
          </div>
        ) : (
          <>
            <MarketingHero isLoggedIn={isLoggedIn} />
            
            {/* Continuous Marquee Text Strip */}
            <div className="w-full overflow-hidden border-y border-white/[0.04] bg-[#0c0c0e]/80 py-3 relative z-10 select-none">
              <div className="flex w-max animate-marquee whitespace-nowrap">
                {[1, 2, 3].map((loop) => (
                  <div key={loop} className="flex items-center gap-16 px-8 text-[11px] font-mono font-semibold tracking-wider text-white/30 uppercase">
                    <span className="text-violet-400 font-sans font-bold flex items-center gap-1">⚡ TRACKING LISTINGS:</span>
                    <span>Razorpay</span>
                    <span className="text-white/20 font-bold">·</span>
                    <span>Swiggy</span>
                    <span className="text-white/20 font-bold">·</span>
                    <span>Zerodha</span>
                    <span className="text-white/20 font-bold">·</span>
                    <span>PhonePe</span>
                    <span className="text-white/20 font-bold">·</span>
                    <span>CRED</span>
                    <span className="text-white/20 font-bold">·</span>
                    <span>Meesho</span>
                    <span className="text-white/20 font-bold">·</span>
                    <span>Zomato</span>
                    <span className="text-white/20 font-bold">·</span>
                    <span>Groww</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── SECTIONS BELOW ─── */}
      <>
          {/* Colleges */}
          <section className="relative z-10 py-8 border-y border-white/[0.05]">
            <div className="max-w-5xl mx-auto px-5 sm:px-8">
              <p className="text-center text-xs text-white/25 uppercase tracking-widest mb-5">Trusted by students at</p>
              <div className="flex flex-wrap gap-x-8 gap-y-3 items-center justify-center">
                {COLLEGES.map(c => (
                  <span key={c} className="text-sm text-white/18 hover:text-white/40 transition-colors font-medium cursor-default">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Flow Diagram Section (Horizontal Step Diagram) */}
          <section id="flow-diagram" className="relative z-10 py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
              <motion.div {...inView()} className="text-center mb-16">
                <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Workflow</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">The InternHunt Loop</h2>
                <p className="text-white/40 max-w-lg mx-auto leading-relaxed">
                  How our automated pipeline delivers matching opportunities directly to you.
                </p>
              </motion.div>

              <div className="relative">
                {/* Connecting Line for desktop */}
                <div className="hidden lg:block absolute top-[45%] left-[8%] right-[8%] h-[1px] bg-gradient-to-r from-violet-600/30 via-purple-500/30 to-indigo-600/30 -translate-y-1/2" />

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                  {[
                    { step: '01', title: 'Set up profile', desc: 'Specify your target roles, skills, and preferences in under 2 minutes.', icon: BrainCircuit, glow: 'from-violet-500/10' },
                    { step: '02', title: 'Agent hunts daily', desc: 'Our background agent crawls platforms, filtering out irrelevant listings.', icon: Zap, glow: 'from-purple-500/10' },
                    { step: '03', title: 'Wake up to matches', desc: 'Wake up to a highly matching list scored directly against your profile.', icon: Star, glow: 'from-indigo-500/10' },
                    { step: '04', title: 'Apply in one click', desc: 'Use AI generated cover letters customized for the role to apply instantly.', icon: FileText, glow: 'from-rose-500/10' },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.title}
                        {...inView(idx * 0.1)}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className="group relative p-6 rounded-2xl border border-white/[0.07] bg-[#111111]/80 overflow-hidden flex flex-col items-center text-center transition-all duration-300"
                      >
                        <div className={cn("absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500", item.glow)} />
                        <div className="relative flex flex-col items-center">
                          {/* Number Bubble */}
                          <span className="text-[10px] font-mono font-bold text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full mb-4">
                            STEP {item.step}
                          </span>

                          {/* Icon Container */}
                          <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-5 h-5 text-violet-300" strokeWidth={2} />
                          </div>

                          <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                          <p className="text-white/40 text-xs leading-relaxed max-w-[220px]">{item.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Product preview */}
          <section className="relative z-10 py-20 border-t border-white/[0.05] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.03] to-transparent pointer-events-none" />
            <div className="max-w-4xl mx-auto px-5 sm:px-8">
              <motion.div {...inView()} className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">What your mornings look like</h2>
                <p className="text-white/35 text-sm">Real matches. Real cover letters. Zero manual effort.</p>
              </motion.div>

              <motion.div {...inView(0.1)} className="relative mx-auto max-w-lg">
                <div className="absolute inset-0 bg-violet-500/10 blur-3xl rounded-3xl" />
                <div className="relative rounded-2xl border border-white/[0.10] bg-[#111111]/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 mx-4 h-6 rounded-md bg-white/[0.04] flex items-center px-3">
                      <span className="text-xs text-white/25">internhunt.in/dashboard</span>
                    </div>
                  </div>
                  <div className="px-5 pt-5 pb-3 border-b border-white/[0.05]">
                    <p className="text-sm font-semibold text-white">Good morning, Intern ☀️</p>
                    <p className="text-xs text-white/35 mt-0.5">Agent found <span className="text-violet-400 font-medium">5 new matches</span> overnight</p>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <MockMatchCard id="1" company="Razorpay" role="Frontend Developer Intern" score={92} stipend="₹25k/mo" delay={0.3} />
                    <MockMatchCard id="2" company="Swiggy" role="Software Engineering Intern" score={87} stipend="₹30k/mo" delay={0.4} />
                    <MockMatchCard id="3" company="Zerodha" role="Full Stack Developer Intern" score={78} stipend="₹20k/mo" delay={0.5} />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="relative z-10 py-24 md:py-32 border-t border-white/[0.05]">
            <div className="max-w-5xl mx-auto px-5 sm:px-8">
              <motion.div {...inView()} className="text-center mb-16">
                <p className="text-xs text-violet-400 uppercase tracking-widest font-medium mb-3">Process</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">How it works</h2>
                <p className="text-white/40 max-w-lg mx-auto">Get started in under 2 minutes. Your agent handles everything else.</p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 md:gap-6">
                {STEPS.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <motion.div key={s.t} {...inView(i * 0.1)}>
                      <div className="flex items-start gap-4 md:flex-col md:gap-0">
                        <div className="relative md:mb-5 flex-shrink-0">
                          <div className="w-14 h-14 rounded-2xl bg-[#111111] border border-white/[0.08] flex items-center justify-center">
                            <Icon className="w-6 h-6 text-violet-400" strokeWidth={1.75} />
                          </div>
                          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-violet-500 border-2 border-[#0a0a0a] flex items-center justify-center text-[9px] font-bold text-white">
                            {i + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white mb-2">{s.t}</h3>
                          <p className="text-white/40 text-sm leading-relaxed">{s.d}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <motion.div {...inView(0.3)} className="text-center mt-14">
                <Link href="/onboarding">
                  <Button size="lg" className="bg-white text-black hover:bg-white/92 px-10 h-13 font-semibold rounded-full transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/10 group">
                    Start your hunt
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <p className="text-xs text-white/25 mt-4 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Free forever · No credit card · No spam
                </p>
              </motion.div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="relative z-10 py-24 border-t border-white/[0.05]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/[0.05] via-transparent to-rose-600/[0.05] pointer-events-none" />
            <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
              <motion.div {...inView()}>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.02] border border-white/[0.04] mb-5">
                  <Users className="w-3 h-3 text-violet-400/50" />
                  <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Join 5,000+ students hunting smarter</span>
                </div>
                <h2 className="text-4xl md:text-[52px] font-bold text-white mb-5 tracking-tight leading-tight">
                  Your next internship<br />is waiting.
                </h2>
                <p className="text-white/40 mb-9 text-lg">Let AI do the boring part. You handle the interviews.</p>
                <Link href="/onboarding">
                  <Button size="lg" className="bg-white text-black hover:bg-white/92 px-12 h-14 text-base font-semibold rounded-full transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/10 group">
                    Activate your agent
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-12 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/20">
                <Zap className="w-4 h-4 text-white fill-white/10" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Intern<span className="text-violet-400">Hunt</span>
              </span>
              <span className="text-white/20 text-xs mx-1">·</span>
              <span className="text-xs text-white/30">Your career, automated.</span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/30">
              <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white/60 transition-colors">Terms & Conditions</Link>
              <Link href="/disclaimer" className="hover:text-white/60 transition-colors">Disclaimer</Link>
              <Link href="/cookies" className="hover:text-white/60 transition-colors">Cookie Policy</Link>
              <Link href="/refunds" className="hover:text-white/60 transition-colors">Refund Policy</Link>
              <Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link>
              <a href="https://www.instagram.com/atul_sharmx_/" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">Instagram</a>
              <a href="https://github.com/AtulSharmx" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">GitHub</a>
            </div>
          </div>
          <p className="text-center text-xs text-white/15 mt-8">© 2026 InternHunt. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
