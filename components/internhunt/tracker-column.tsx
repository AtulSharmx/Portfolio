'use client'

import { cn } from '@/lib/utils'
import { ChevronRight, Building2 } from 'lucide-react'

interface TrackerApplication {
  id: string
  company: string
  role: string
  dateApplied: string
}

interface TrackerColumnProps {
  title: string
  applications: TrackerApplication[]
  status: 'applied' | 'heard-back' | 'rejected'
  onMoveApplication?: (id: string, newStatus: string) => void
  className?: string
}

const STATUS_CONFIG = {
  'applied': {
    headerColor: 'text-violet-400',
    dotColor:    'bg-violet-400',
    topBorder:   'border-t-violet-500/50',
    badge:       'bg-violet-500/10 text-violet-400',
    iconBg:      'bg-violet-500/15 border-violet-500/20 text-violet-300',
    moveOptions: [
      { status: 'heard-back', label: 'Heard Back →' },
      { status: 'rejected',   label: 'Rejected ✕' },
    ],
  },
  'heard-back': {
    headerColor: 'text-emerald-400',
    dotColor:    'bg-emerald-400',
    topBorder:   'border-t-emerald-500/50',
    badge:       'bg-emerald-500/10 text-emerald-400',
    iconBg:      'bg-emerald-500/15 border-emerald-500/20 text-emerald-300',
    moveOptions: [
      { status: 'applied',  label: '← Applied' },
      { status: 'rejected', label: 'Rejected ✕' },
    ],
  },
  'rejected': {
    headerColor: 'text-red-400',
    dotColor:    'bg-red-400',
    topBorder:   'border-t-red-500/50',
    badge:       'bg-red-500/10 text-red-400',
    iconBg:      'bg-red-500/15 border-red-500/20 text-red-300',
    moveOptions: [
      { status: 'applied',     label: '← Applied' },
      { status: 'heard-back',  label: 'Heard Back' },
    ],
  },
}

function CompanyAvatar({ name, className }: { name: string; className?: string }) {
  const colors = [
    'from-violet-500/25 to-purple-600/15 text-violet-300',
    'from-blue-500/25 to-indigo-600/15 text-blue-300',
    'from-emerald-500/25 to-green-600/15 text-emerald-300',
    'from-rose-500/25 to-pink-600/15 text-rose-300',
    'from-amber-500/25 to-orange-600/15 text-amber-300',
  ]
  const idx = name.charCodeAt(0) % colors.length
  return (
    <div className={cn(
      'w-8 h-8 rounded-lg bg-gradient-to-br border border-white/[0.08] flex items-center justify-center flex-shrink-0',
      colors[idx], className
    )}>
      <span className="text-xs font-bold">{name[0].toUpperCase()}</span>
    </div>
  )
}

export function TrackerColumn({
  title,
  applications,
  status,
  onMoveApplication,
  className,
}: TrackerColumnProps) {
  const cfg = STATUS_CONFIG[status]

  return (
    <div className={cn('flex flex-col min-w-0', className)}>
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={cn('w-2 h-2 rounded-full flex-shrink-0', cfg.dotColor)} />
        <h3 className={cn('text-sm font-semibold', cfg.headerColor)}>{title}</h3>
        <span className={cn(
          'text-xs font-medium px-2 py-0.5 rounded-full ml-auto',
          cfg.badge
        )}>
          {applications.length}
        </span>
      </div>

      {/* Cards container */}
      <div className={cn(
        'flex-1 rounded-xl border-t-2 border border-border p-3 space-y-2.5 min-h-[220px] bg-card/30',
        cfg.topBorder
      )}>
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-28 gap-2 text-center">
            <Building2 className="w-6 h-6 text-muted-foreground/25" />
            <p className="text-xs text-muted-foreground/40">No applications here yet</p>
          </div>
        ) : (
          applications.map((app, index) => (
            <div
              key={app.id}
              className={cn(
                'group bg-card border border-border rounded-xl p-3.5',
                'hover:border-white/[0.12] transition-all duration-200',
                'animate-fade-up',
                `stagger-${Math.min(index + 1, 8)}`
              )}
            >
              {/* Card header */}
              <div className="flex items-start gap-2.5 mb-2">
                <CompanyAvatar name={app.company} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate leading-snug">
                    {app.role}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{app.company}</p>
                </div>
              </div>

              {/* Date */}
              <p className="text-[11px] text-muted-foreground/50 mb-2.5">{app.dateApplied}</p>

              {/* Move buttons — show on hover */}
              {onMoveApplication && (
                <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                  {cfg.moveOptions.map(opt => (
                    <button
                      key={opt.status}
                      onClick={() => onMoveApplication(app.id, opt.status)}
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium',
                        'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground',
                        'transition-colors border border-border'
                      )}
                    >
                      {opt.label}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
