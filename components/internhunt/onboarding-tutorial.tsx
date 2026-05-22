'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    targetId: 'tutorial-agent-card',
    mobileTargetId: 'tutorial-agent-card',
    title: 'AI Agent Status',
    content: "This is your AI agent. It hunts internships for you every day automatically.",
  },
  {
    targetId: 'tutorial-matches-section',
    mobileTargetId: 'tutorial-matches-section',
    title: "Today's Matches",
    content: "Your matches appear here every day ranked by how well they fit your profile.",
  },
  {
    targetId: 'tutorial-match-card-0',
    mobileTargetId: 'tutorial-match-card-0',
    fallbackId: 'tutorial-matches-section',
    title: 'Match Cards',
    content: "Click any match to see the full details and your AI generated cover letter ready to copy.",
  },
  {
    targetId: 'sidebar-tracker',
    mobileTargetId: 'sidebar-tracker-mobile',
    title: 'Applications Tracker',
    content: "Track every application you send here. Never lose track of where you applied.",
  },
  {
    targetId: 'sidebar-insights',
    mobileTargetId: 'sidebar-insights-mobile',
    title: 'Skills Insights',
    content: "See which skills to learn next to unlock more opportunities.",
  },
]

export function OnboardingTutorial() {
  const { user, updateUser } = useUser()
  const [currentStep, setCurrentStep] = useState(0)
  const [coords, setCoords] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Only show if user is loaded and hasn't seen tutorial
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setIsVisible(user.hasSeenTutorial === false)
      }, 0)
    }
  }, [user])

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsVisible(false)
    await updateUser({ hasSeenTutorial: true })
  }

  const updateCoords = useCallback(() => {
    if (!isVisible) return

    const stepConfig = STEPS[currentStep]
    let el = document.getElementById(stepConfig.targetId)

    if (window.innerWidth < 768 && stepConfig.mobileTargetId) {
      const mobEl = document.getElementById(stepConfig.mobileTargetId)
      if (mobEl) el = mobEl
    }

    if (!el && stepConfig.fallbackId) {
      el = document.getElementById(stepConfig.fallbackId)
    }

    if (el) {
      // Scroll target into view
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // Wait briefly for scroll/layout to settle
      const timeout = setTimeout(() => {
        const rect = el!.getBoundingClientRect()
        setCoords({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        })
      }, 200)

      return () => clearTimeout(timeout)
    } else {
      setCoords(null)
    }
  }, [currentStep, isVisible])

  useEffect(() => {
    const t = setTimeout(() => {
      updateCoords()
    }, 0)
    window.addEventListener('resize', updateCoords)
    window.addEventListener('scroll', updateCoords)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', updateCoords)
      window.removeEventListener('scroll', updateCoords)
    }
  }, [updateCoords])

  if (!isVisible) return null

  // Position logic
  let tooltipStyle: React.CSSProperties = {}
  if (coords) {
    const spaceBelow = window.innerHeight - (coords.y - window.scrollY + coords.height)
    const placeBelow = spaceBelow > 220

    let topVal = placeBelow
      ? coords.y + coords.height + 12
      : coords.y - 12 - 165 // estimated tooltip height

    // Fallback clamps
    topVal = Math.max(16 + window.scrollY, topVal)

    const leftVal = Math.max(
      16,
      Math.min(
        window.innerWidth - 320,
        coords.x + coords.width / 2 - 150
      )
    )

    tooltipStyle = {
      position: 'absolute',
      top: `${topVal}px`,
      left: `${leftVal}px`,
      width: '300px',
      pointerEvents: 'auto',
    }
  } else {
    tooltipStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      pointerEvents: 'auto',
    }
  }

  const stepInfo = STEPS[currentStep]

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {/* Dark Cutout Overlay */}
      {coords && (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-40">
          <defs>
            <mask id="tutorial-cutout-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={coords.x - window.scrollX - 6}
                y={coords.y - window.scrollY - 6}
                width={coords.width + 12}
                height={coords.height + 12}
                rx="14"
                ry="14"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.75)"
            mask="url(#tutorial-cutout-mask)"
          />
        </svg>
      )}

      {/* Tooltip Popover */}
      <div
        style={tooltipStyle}
        className={cn(
          'bg-[#111111] border border-violet-500/20 text-foreground rounded-2xl p-5 shadow-2xl z-50 pointer-events-auto',
          'flex flex-col gap-3 animate-scale-in border-l-4 border-l-primary'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Tour</span>
          </div>
          <button
            onClick={handleComplete}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Skip tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-foreground">{stepInfo.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{stepInfo.content}</p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <span className="text-[10px] text-muted-foreground font-semibold">
            {currentStep + 1} of {STEPS.length}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComplete}
              className="h-8 text-[11px] text-muted-foreground hover:text-foreground rounded-lg"
            >
              Skip
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
              className="h-8 text-[11px] bg-primary hover:bg-primary/95 text-primary-foreground font-medium rounded-lg gap-1"
            >
              <span>{currentStep === STEPS.length - 1 ? 'Done' : 'Next'}</span>
              {currentStep < STEPS.length - 1 && <ArrowRight className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
