'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

interface OnboardingStepProps {
  currentStep: number
  totalSteps: number
  title: string
  subtitle?: string
  children: React.ReactNode
  onNext: () => void
  onBack?: () => void
  isNextDisabled?: boolean
  isLoading?: boolean
  nextLabel?: string
}

export function OnboardingStep({
  currentStep,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  isNextDisabled = false,
  isLoading = false,
  nextLabel = 'Continue',
}: OnboardingStepProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Top bar: progress ── */}
      <header className="flex-none">
        {/* Progress bar + dots */}
        <div className="px-6 pt-4 pb-2">
          {/* Segmented progress */}
          <div className="flex items-center gap-1.5 mb-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'flex-1 h-1 rounded-full transition-all duration-500',
                  i < currentStep
                    ? 'bg-primary'
                    : i === currentStep - 1
                    ? 'bg-primary/70'
                    : 'bg-muted'
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          {/* Step heading */}
          <div className="mb-8 animate-fade-up">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-snug text-balance mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Children slot */}
          <div className="mb-8 animate-fade-up stagger-1">
            {children}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 animate-fade-up stagger-2">
            {onBack && (
              <Button
                variant="ghost"
                onClick={onBack}
                className="gap-2 text-muted-foreground hover:text-foreground"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}

            <Button
              onClick={onNext}
              disabled={isNextDisabled || isLoading}
              className={cn(
                'flex-1 h-12 font-semibold gap-2 bg-primary text-primary-foreground',
                'hover:bg-primary/90 btn-hover',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none'
              )}
            >
              {isLoading ? (
                <>
                  <Spinner size={16} color="var(--primary-foreground)" />
                  Setting up your agent…
                </>
              ) : (
                <>
                  {nextLabel}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Trust line */}
      <footer className="flex-none py-4 text-center">
        <p className="text-xs text-muted-foreground/50">
          🔒 We never spam. Takes less than 2 minutes.
        </p>
      </footer>
    </div>
  )
}
