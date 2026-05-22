'use client'

import { cn } from '@/lib/utils'
import { Zap, Pause, Play, Clock } from 'lucide-react'

interface AgentStatusCardProps {
  isActive: boolean
  lastRunTime: string
  nextRunTime: string
  className?: string
  onToggle?: () => void
}

export function AgentStatusCard({
  isActive,
  lastRunTime,
  nextRunTime,
  className,
  onToggle,
}: AgentStatusCardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-2xl p-5 relative overflow-hidden',
        'transition-all duration-300',
        isActive ? 'border-success/20' : 'border-border',
        className
      )}
    >
      {/* Subtle active glow */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-transparent pointer-events-none" />
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center',
              isActive ? 'bg-success/15 border border-success/25' : 'bg-muted border border-border'
            )}>
              <Zap
                className={cn('w-4.5 h-4.5', isActive ? 'text-success' : 'text-muted-foreground')}
                strokeWidth={2}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI Agent</h3>
              <div className="flex items-center gap-1.5">
                {/* Pulsing dot */}
                <span className="relative flex h-1.5 w-1.5">
                  {isActive && (
                    <span className="animate-ping-sm absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                  )}
                  <span className={cn(
                    'relative inline-flex rounded-full h-1.5 w-1.5',
                    isActive ? 'bg-success' : 'bg-muted-foreground'
                  )} />
                </span>
                <span className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-success' : 'text-muted-foreground'
                )}>
                  {isActive ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle */}
          {onToggle && (
            <button
              onClick={onToggle}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                'transition-all duration-200 border',
                isActive
                  ? 'bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                  : 'bg-success/10 border-success/25 text-success hover:bg-success/15'
              )}
              aria-label={isActive ? 'Pause agent' : 'Resume agent'}
            >
              {isActive ? (
                <><Pause className="w-3 h-3" /> Pause</>
              ) : (
                <><Play className="w-3 h-3" /> Resume</>
              )}
            </button>
          )}
        </div>

        {/* Run times */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              Last run
            </span>
            <span className="text-xs font-medium text-foreground">{lastRunTime}</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              Next run
            </span>
            <span className="text-xs font-medium text-foreground">{nextRunTime}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
