'use client'

import { cn } from '@/lib/utils'
import { ExternalLink, TrendingUp, Clock } from 'lucide-react'

interface InsightCardProps {
  skill: string
  percentage: number
  domain: string
  learnLink?: string
  estimatedHours?: number
  trend?: number   // positive = up, negative = down
  className?: string
  staggerIndex?: number
}

export function InsightCard({
  skill,
  percentage,
  domain,
  learnLink,
  estimatedHours = 20,
  trend,
  className,
  staggerIndex = 0,
}: InsightCardProps) {
  const barColor =
    percentage >= 70 ? 'bg-rose-500' :
    percentage >= 50 ? 'bg-amber-500' :
    'bg-emerald-500'

  const badgeColor =
    percentage >= 70 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
    percentage >= 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'

  return (
    <div
      className={cn(
        'group bg-card border border-border rounded-2xl p-5',
        'hover:border-white/[0.12] transition-all duration-250 hover:-translate-y-1',
        'animate-fade-up',
        `stagger-${Math.min(staggerIndex + 1, 8)}`,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground">{skill}</h3>
            {trend !== undefined && (
              <span className={cn(
                'text-xs font-medium flex items-center gap-0.5',
                trend > 0 ? 'text-rose-400' : 'text-emerald-400'
              )}>
                <TrendingUp className={cn('w-3 h-3', trend < 0 && 'rotate-180')} />
                {Math.abs(trend)}%
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{domain}</p>
        </div>

        <div className="flex-shrink-0 text-right">
          <span className={cn(
            'inline-block px-2.5 py-1 rounded-full border text-sm font-bold',
            badgeColor
          )}>
            {percentage}%
          </span>
          <p className="text-[10px] text-muted-foreground mt-1">of missed roles</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700 ease-out', barColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        Adding <span className="text-foreground font-medium">{skill}</span> to your profile could unlock{' '}
        <span className="text-foreground font-medium">{percentage}%</span> more{' '}
        <span className="text-muted-foreground">{domain}</span> opportunities.
      </p>

      {/* Footer */}
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          ~{estimatedHours}h to learn
        </span>

        {learnLink && (
          <a
            href={learnLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
              'text-xs font-medium text-primary border border-primary/25',
              'bg-primary/8 hover:bg-primary/15 transition-colors'
            )}
          >
            Learn free
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}
