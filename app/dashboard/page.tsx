'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/internhunt/nav-bar'
import { AgentStatusCard } from '@/components/internhunt/agent-status-card'
import { MatchCard } from '@/components/internhunt/match-card'
import { SkeletonCard, SkeletonAgentCard } from '@/components/internhunt/skeleton-card'
import { Search, TrendingUp, Target, Send, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import { generateMatchesForUser, GeneratedMatch } from '@/lib/match-engine'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/ui/spinner'
import { OnboardingTutorial } from '@/components/internhunt/onboarding-tutorial'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ── Stat pill ── */
function StatPill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
}) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-border">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-base font-bold text-foreground leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, userId, loading, updateUser } = useUser()
  
  const [isLoading, setIsLoading] = useState(true)
  const [matches, setMatches] = useState<GeneratedMatch[]>([])
  const [sortBy, setSortBy] = useState<'score' | 'stipend'>('score')
  const [agentActive, setAgentActive] = useState(true)
  const [appliedCount, setAppliedCount] = useState(0)

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/onboarding')
    }
  }, [user, loading, router])

  const [prevUserId, setPrevUserId] = useState<string | null>(null)
  if (userId && userId !== prevUserId) {
    setPrevUserId(userId)
    setAgentActive(user?.isActive ?? true)
    const userMatches = generateMatchesForUser(user)
    setMatches(userMatches)
    setIsLoading(false)
  }

  // Load applied count from tracker Supabase
  useEffect(() => {
    if (!userId) return

    const fetchAppliedCount = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('status')
          .eq('user_id', userId)

        if (error) throw error
        
        if (data) {
          setAppliedCount(data.filter((a: any) => a.status === 'applied').length)
        } else {
          setAppliedCount(0)
        }
      } catch (err) {
        console.error('Error fetching applied count:', err)
        setAppliedCount(0)
      }
    }

    fetchAppliedCount()
  }, [userId])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size={24} />
      </div>
    )
  }

  const sortedMatches = [...matches].sort((a, b) =>
    sortBy === 'score'
      ? b.matchScore - a.matchScore
      : parseInt(b.stipend.replace(/\D/g, '')) - parseInt(a.stipend.replace(/\D/g, ''))
  )

  const bestScore = matches.length > 0 ? matches[0].matchScore : 0
  const maxScanned = user.skills.length > 0 ? user.skills.length * 240 + 280 : 0

  const formatRunTime = (timeStr: string) => {
    if (!timeStr) return '8:00 AM'
    try {
      const [h, m] = timeStr.split(':')
      const hour = parseInt(h)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      return `${displayHour}:${m || '00'} ${ampm}`
    } catch {
      return timeStr
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <NavBar />
      <OnboardingTutorial />

      <main className="flex-1 pb-24 md:pb-0 min-w-0">
        <div className="max-w-3xl mx-auto px-4 py-6 md:px-8 md:py-8">

          {/* ── Greeting ── */}
          <div className="mb-7 animate-fade-up">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {getGreeting()}, {user.name ? (user.name.trim().split(' ')[0] || 'Intern') : 'Intern'} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              Your agent ran 2 hours ago ·{' '}
              <span className="text-foreground font-medium">{matches.length} new matches</span> found for your{' '}
              {user.domains.length > 0 ? user.domains[0] : 'profile'}{' '}
              interests.
            </p>
          </div>

          {/* ── Stats bar ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7 animate-fade-up stagger-1">
            <StatPill icon={Search}     label="Scanned today"  value={maxScanned.toLocaleString()}  color="bg-violet-500/10 text-violet-400" />
            <StatPill icon={Target}     label="Match rate"     value={`${matches.length > 0 ? Math.round(matches.reduce((acc, m) => acc + m.matchScore, 0) / matches.length) : 0}%`}    color="bg-emerald-500/10 text-emerald-400" />
            <StatPill icon={Send}       label="Applied"        value={appliedCount}      color="bg-blue-500/10 text-blue-400" />
            <StatPill icon={TrendingUp} label="Best score"     value={`${bestScore}%`}     color="bg-amber-500/10 text-amber-400" />
          </div>

          {/* ── Agent cards ── */}
          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            {isLoading ? (
              <>
                <SkeletonAgentCard />
                <SkeletonAgentCard />
              </>
            ) : (
              <>
                <div id="tutorial-agent-card" className="w-full">
                  <AgentStatusCard
                    isActive={agentActive}
                    lastRunTime={`Today, ${formatRunTime(user.runTime)}`}
                    nextRunTime={`Tomorrow, ${formatRunTime(user.runTime)}`}
                    onToggle={async () => {
                      const nextVal = !agentActive
                      setAgentActive(nextVal)
                      await updateUser({ isActive: nextVal })
                    }}
                    className="animate-fade-up stagger-2"
                  />
                </div>

                {/* Streak card */}
                {(() => {
                  const getStreak = (createdAtStr?: string) => {
                    if (!createdAtStr) return 1
                    try {
                      const createdDate = new Date(createdAtStr)
                      const today = new Date()
                      const diffTime = Math.abs(today.getTime() - createdDate.getTime())
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      return Math.max(1, diffDays)
                    } catch {
                      return 1
                    }
                  }
                  const streak = getStreak(user.createdAt)
                  return (
                    <div className="bg-card border border-border rounded-2xl p-5 animate-fade-up stagger-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                          <Flame className="w-4.5 h-4.5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground leading-none">{streak}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Day streak</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Your agent has run <span className="text-foreground font-medium">{streak} days straight</span>. Keep going!
                      </p>
                      {/* Mini streak dots */}
                      <div className="flex gap-1.5 mt-3">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'h-1.5 flex-1 rounded-full',
                              i < streak ? 'bg-amber-400' : 'bg-muted'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </>
            )}
          </div>

          {/* ── Matches ── */}
          <div id="tutorial-matches-section">
            {/* Header + sort */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-semibold text-foreground">
                  Today&apos;s Matches
                </h2>
                {!isLoading && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {matches.length}
                  </span>
                )}
              </div>

              {!isLoading && matches.length > 0 && (
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted border border-border">
                  <button
                    onClick={() => setSortBy('score')}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                      sortBy === 'score'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    By score
                  </button>
                  <button
                    onClick={() => setSortBy('stipend')}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                      sortBy === 'stipend'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    By stipend
                  </button>
                </div>
              )}
            </div>

            {/* Loading skeletons */}
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : matches.length === 0 ? (
              /* Empty state */
              <div className="bg-card border border-border rounded-2xl p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  Your agent is on it
                </h3>
                <p className="text-sm text-muted-foreground">
                  Check back after tomorrow, {formatRunTime(user.runTime)} for fresh matches.
                </p>
              </div>
            ) : (
              /* Match list */
              <div className="space-y-3">
                {sortedMatches.map((match, index) => (
                  <div key={match.id} id={index === 0 ? 'tutorial-match-card-0' : undefined}>
                    <MatchCard {...match} staggerIndex={index} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
