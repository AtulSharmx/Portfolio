'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ScoreRing } from './score-ring'
import { Button } from '@/components/ui/button'
import { MapPin, IndianRupee, Calendar, ArrowRight, ExternalLink } from 'lucide-react'

interface MatchCardProps {
  id: string
  company: string
  role: string
  stipend: string
  location: string
  matchScore: number
  deadline: string
  className?: string
  staggerIndex?: number
}

function CompanyAvatar({ name }: { name: string }) {
  // Deterministic color from company name
  const colors = [
    'from-violet-500/30 to-purple-600/20 border-violet-500/20 text-violet-300',
    'from-blue-500/30 to-indigo-600/20 border-blue-500/20 text-blue-300',
    'from-emerald-500/30 to-green-600/20 border-emerald-500/20 text-emerald-300',
    'from-rose-500/30 to-pink-600/20 border-rose-500/20 text-rose-300',
    'from-amber-500/30 to-orange-600/20 border-amber-500/20 text-amber-300',
    'from-cyan-500/30 to-sky-600/20 border-cyan-500/20 text-cyan-300',
  ]
  const idx = name.charCodeAt(0) % colors.length

  return (
    <div className={cn(
      'w-11 h-11 rounded-xl bg-gradient-to-br border flex items-center justify-center flex-shrink-0',
      colors[idx]
    )}>
      <span className="text-sm font-bold">{name[0].toUpperCase()}</span>
    </div>
  )
}

export function MatchCard({
  id,
  company,
  role,
  stipend,
  location,
  matchScore,
  deadline,
  className,
  staggerIndex = 0,
}: MatchCardProps) {
  const scoreColor = matchScore >= 80
    ? 'bg-success/15 text-success border-success/25'
    : matchScore >= 60
    ? 'bg-warning/15 text-warning border-warning/25'
    : 'bg-destructive/15 text-destructive border-destructive/25'

  const isTopMatch = matchScore >= 80

  return (
    <div
      className={cn(
        'group bg-card border border-border rounded-2xl p-5',
        'transition-all duration-250 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30',
        'animate-fade-up',
        `stagger-${Math.min(staggerIndex + 1, 8)}`,
        isTopMatch && 'hover:border-success/30',
        className
      )}
    >
      {/* Top row: avatar + info + score */}
      <div className="flex items-start gap-3.5">
        <CompanyAvatar name={company} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground leading-snug truncate pr-2">
                {role}
              </h3>
              <p className="text-sm text-muted-foreground font-medium mt-0.5">{company}</p>
            </div>
            <ScoreRing score={matchScore} size="sm" showLabel={false} />
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {location}
            </span>
            <span className="text-muted-foreground/30 text-xs">·</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <IndianRupee className="w-3.5 h-3.5 flex-shrink-0" />
              {stipend.replace('₹', '')}
            </span>
          </div>
        </div>
      </div>

      {/* Score + deadline row */}
      <div className="flex items-center gap-2 mt-3.5">
        <span className={cn(
          'inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border',
          scoreColor
        )}>
          {matchScore}% match
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
          <Calendar className="w-3.5 h-3.5" />
          {deadline}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-border flex gap-2">
        <Link href={`/match/${id}`} className="flex-1">
          <Button
            size="sm"
            className="w-full gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 font-medium text-xs h-9"
          >
            View & Copy Cover Letter
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <Button
          size="sm"
          variant="outline"
          className="h-9 w-9 p-0 border-border text-muted-foreground hover:text-foreground flex-shrink-0"
          aria-label="Open job listing"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
