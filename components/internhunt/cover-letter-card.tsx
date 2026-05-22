'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Copy, Check, ChevronDown, ChevronUp, FileText } from 'lucide-react'

interface CoverLetterCardProps {
  content: string
  className?: string
}

export function CoverLetterCard({ content, className }: CoverLetterCardProps) {
  const [copied, setCopied]   = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className={cn(
      'bg-card border border-border rounded-2xl overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground flex-1">AI Cover Letter</h3>

        <div className="flex items-center gap-2">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
              'transition-all duration-200 border',
              copied
                ? 'bg-success/10 border-success/25 text-success'
                : 'bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border/80'
            )}
            aria-label="Copy cover letter"
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5" /> Copied!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Copy</>
            )}
          </button>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Collapse</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> Expand</>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <div
          className={cn(
            'px-5 py-4 overflow-hidden transition-all duration-500 ease-out',
            expanded ? 'max-h-[2400px]' : 'max-h-36'
          )}
        >
          <pre className="font-sans text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
            {content}
          </pre>
        </div>

        {/* Fade overlay when collapsed */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none" />
        )}

        {/* Inline expand prompt */}
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-primary/70 hover:text-primary transition-colors font-medium"
          >
            Show full letter
          </button>
        )}
      </div>
    </div>
  )
}
