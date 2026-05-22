'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/internhunt/nav-bar'
import { ScoreRing } from '@/components/internhunt/score-ring'
import { SkillBadge } from '@/components/internhunt/skill-badge'
import { CoverLetterCard } from '@/components/internhunt/cover-letter-card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft, MapPin, IndianRupee, Calendar, Timer,
  CheckCircle2, XCircle, ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import { getSingleMatchDetails, GeneratedMatch } from '@/lib/match-engine'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/ui/spinner'

/* ── Company header ── */
function CompanyHeader({ name, role, score }: { name: string; role: string; score: number }) {
  const colors = [
    'from-violet-500/25 to-purple-600/15 border-violet-500/20 text-violet-300',
    'from-blue-500/25 to-indigo-600/15 border-blue-500/20 text-blue-300',
    'from-emerald-500/25 to-green-600/15 border-emerald-500/20 text-emerald-300',
    'from-rose-500/25 to-pink-600/15 border-rose-500/20 text-rose-300',
    'from-amber-500/25 to-orange-600/15 border-amber-500/20 text-amber-300',
  ]
  const idx = name.charCodeAt(0) % colors.length

  return (
    <div className="flex items-start gap-4 mb-6 animate-fade-up">
      <div className={cn(
        'w-14 h-14 rounded-2xl bg-gradient-to-br border flex items-center justify-center flex-shrink-0',
        colors[idx]
      )}>
        <span className="text-xl font-bold">{name[0].toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-foreground leading-snug">{role}</h1>
        <p className="text-base text-muted-foreground font-medium mt-0.5">{name}</p>
      </div>
      <ScoreRing score={score} size="md" />
    </div>
  )
}

/* ── Detail pill ── */
function DetailPill({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-card border border-border">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div>
        <p className="text-[10px] text-muted-foreground leading-none">{label}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  )
}

/* ── Loading skeleton ── */
function LoadingSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-14 w-3/4 skeleton-shimmer rounded-xl" />
      <div className="grid grid-cols-2 gap-3">
        {[1,2,3,4].map(i => <div key={i} className="h-14 skeleton-shimmer rounded-xl" />)}
      </div>
      <div className="h-32 skeleton-shimmer rounded-2xl" />
      <div className="h-64 skeleton-shimmer rounded-2xl" />
    </div>
  )
}

/* ── Page ── */
export default function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, userId, loading } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [match, setMatch] = useState<GeneratedMatch | null>(null)
  const [applied, setApplied] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/onboarding')
    }
  }, [user, loading, router])

  const [prevUserId, setPrevUserId] = useState<string | null>(null)
  const [prevMatchId, setPrevMatchId] = useState<string | null>(null)

  let currentMatch = match
  if (userId && user && (userId !== prevUserId || id !== prevMatchId)) {
    setPrevUserId(userId)
    setPrevMatchId(id)
    const details = getSingleMatchDetails(id, user)
    setMatch(details)
    currentMatch = details
  }

  useEffect(() => {
    if (loading || !user || !userId || !currentMatch) return

    const checkAppliedAndLoaded = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('id')
          .eq('user_id', userId)
          .eq('company', currentMatch.company)
          .eq('role', currentMatch.role)
          .maybeSingle()

        if (data) {
          setApplied(true)
        } else {
          setApplied(false)
        }
      } catch (e) {
        console.error('Error checking application status:', e)
      } finally {
        setIsLoading(false)
      }
    }

    checkAppliedAndLoaded()
  }, [id, user, userId, loading, currentMatch])

  const handleMarkApplied = async () => {
    if (!match || !userId) return
    setApplied(true)

    try {
      // 1. Check if application already exists
      const { data: existingApp } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', userId)
        .eq('company', match.company)
        .eq('role', match.role)
        .maybeSingle()

      if (existingApp) {
        // Update its status to 'applied'
        await supabase
          .from('applications')
          .update({ status: 'applied' })
          .eq('id', existingApp.id)
      } else {
        // Insert new application
        const dateAppliedStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        await supabase
          .from('applications')
          .insert({
            user_id: userId,
            company: match.company,
            role: match.role,
            date_applied: dateAppliedStr,
            status: 'applied'
          })
      }
    } catch (e) {
      console.error('Failed to save application status', e)
    }

    router.push('/tracker')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size={24} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <NavBar />

      <main className="flex-1 pb-24 md:pb-0 min-w-0">
        <div className="max-w-3xl mx-auto px-4 py-6 md:px-8 md:py-8">

          {/* Back */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to matches
          </Link>

          {isLoading || !match ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Company header */}
              <CompanyHeader name={match.company} role={match.role} score={match.matchScore} />

              {/* Detail pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 animate-fade-up stagger-1">
                <DetailPill icon={MapPin}        label="Location" value={match.location} />
                <DetailPill icon={IndianRupee}   label="Stipend"  value={match.stipend.replace('₹', '')} />
                <DetailPill icon={Calendar}      label="Deadline" value={match.deadline} />
                <DetailPill icon={Timer}         label="Duration" value={match.duration} />
              </div>

              {/* Description */}
              <div className="bg-card border border-border rounded-2xl p-5 mb-4 animate-fade-up stagger-2">
                <h2 className="text-sm font-semibold text-foreground mb-2.5">About this role</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{match.description}</p>
              </div>

              {/* Match Analysis */}
              <div className="bg-card border border-border rounded-2xl p-5 mb-4 animate-fade-up stagger-3">
                <h2 className="text-sm font-semibold text-foreground mb-4">Match Analysis</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      Skills you already have
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {match.matchedSkills.length > 0 ? (
                        match.matchedSkills.map(skill => (
                          <SkillBadge key={skill} skill={skill} variant="matched" size="sm" />
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">None match yet. Add them in settings to improve score!</span>
                      )}
                    </div>
                  </div>

                  {match.missingSkills.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2.5 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-warning" />
                        Skills to learn (optional)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.missingSkills.map(skill => (
                          <SkillBadge key={skill} skill={skill} variant="missing" size="sm" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover letter */}
              <div className="mb-6 animate-fade-up stagger-4">
                <CoverLetterCard content={match.coverLetter} />
              </div>

              {/* Actions */}
              <div className="flex gap-3 animate-fade-up stagger-5">
                <Button
                  onClick={handleMarkApplied}
                  disabled={applied}
                  className={cn(
                    'flex-1 h-12 font-semibold gap-2 rounded-xl btn-hover',
                    applied
                      ? 'bg-success/15 text-success border-success/25 border'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {applied ? (
                    <><CheckCircle2 className="w-4 h-4" /> Marked as applied!</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Mark as Applied</>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="h-12 px-5 rounded-xl gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => router.push('/dashboard')}
                >
                  <XCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Not interested</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-12 w-12 p-0 rounded-xl text-muted-foreground hover:text-foreground"
                  aria-label="Open original listing"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
