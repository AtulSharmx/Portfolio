'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { OnboardingStep } from '@/components/internhunt/onboarding-step'
import { SkillBadge } from '@/components/internhunt/skill-badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RocketLoader } from '@/components/internhunt/rocket-loader'
import { Plus, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { migrateLocalStorageToSupabase } from '@/hooks/use-user'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/* ── Static data ── */
const DOMAINS = [
  'Web Dev', 'Data Science', 'Marketing', 'Design',
  'Finance', 'HR', 'Content', 'Android', 'ML/AI', 'DevOps',
]

const SKILLS = [
  'Python', 'React', 'SQL', 'Figma', 'Excel',
  'Java', 'Node.js', 'JavaScript', 'TypeScript',
  'MongoDB', 'AWS', 'Docker', 'Git', 'C++', 'Flutter',
  'TensorFlow', 'Kotlin', 'Vue.js', 'Next.js',
]

const LOCATIONS = [
  { label: 'Remote', emoji: '🌐' },
  { label: 'On-site', emoji: '🏢' },
  { label: 'Hybrid', emoji: '🔀' },
  { label: 'Flexible', emoji: '✨' },
]

const RUN_TIMES = [
  { label: '7 AM', value: '07:00', desc: 'Early bird' },
  { label: '9 AM', value: '09:00', desc: 'Morning' },
  { label: '12 PM', value: '12:00', desc: 'Midday' },
  { label: '9 PM', value: '21:00', desc: 'Evening' },
  { label: '10 PM', value: '22:00', desc: 'Night owl' },
]

type FormData = {
  name: string
  course: string
  domains: string[]
  skills: string[]
  location: string
  runTime: string
}

const BadgeGrid = ({
  items,
  field,
  selected,
  onToggle,
}: {
  items: string[]
  field: 'domains' | 'skills'
  selected: string[]
  onToggle: (field: 'domains' | 'skills', value: string) => void
}) => (
  <div className="flex flex-wrap gap-2.5">
    {items.map((item, i) => (
      <div key={item} className={cn('animate-scale-in', `stagger-${Math.min(i, 8)}`)}>
        <SkillBadge
          skill={item}
          selected={selected.includes(item)}
          onClick={() => onToggle(field, item)}
        />
      </div>
    ))}
    {/* Custom-added badges */}
    {selected
      .filter(s => !items.includes(s))
      .map(item => (
        <SkillBadge
          key={item}
          skill={item}
          selected
          onClick={() => onToggle(field, item)}
        />
      ))}
  </div>
)

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [customDomain, setCustomDomain] = useState('')
  const [customSkill, setCustomSkill] = useState('')
  const [customTime, setCustomTime] = useState('')
  const [useCustomTime, setUseCustomTime] = useState(false)
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false)

  // Account creation fields
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    course: '',
    domains: [],
    skills: [],
    location: '',
    runTime: '09:00', // Default morning run time
  })

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0)
  }, [])

  // Cooldown countdown for resending email verification
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  // Poll user session when verifying email
  useEffect(() => {
    if (!isVerifyingEmail) return

    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        clearInterval(interval)
        setShowSuccess(true)
        setTimeout(() => router.push('/dashboard'), 800)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isVerifyingEmail, router])

  /* ── Helpers ── */
  const toggleSelection = useCallback((field: 'domains' | 'skills', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))
  }, [])

  const addCustomDomain = useCallback(() => {
    const v = customDomain.trim()
    if (v && !formData.domains.includes(v)) {
      setFormData(p => ({ ...p, domains: [...p.domains, v] }))
      setCustomDomain('')
    }
  }, [customDomain, formData.domains])

  const addCustomSkill = useCallback(() => {
    const v = customSkill.trim()
    if (v && !formData.skills.includes(v)) {
      setFormData(p => ({ ...p, skills: [...p.skills, v] }))
      setCustomSkill('')
    }
  }, [customSkill, formData.skills])

  const handleTimeSelect = (value: string) => {
    setUseCustomTime(false)
    setCustomTime('')
    setFormData(p => ({ ...p, runTime: value }))
  }

  const handleCustomTime = (value: string) => {
    setCustomTime(value)
    setUseCustomTime(true)
    setFormData(p => ({ ...p, runTime: value }))
  }

  const formatTime = (value: string) => {
    if (!value) return ''
    const [h] = value.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${display} ${ampm}`
  }

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.name.trim() !== '' && formData.course.trim() !== ''
      case 2: return formData.domains.length > 0
      case 3: return formData.skills.length > 0
      case 4: return formData.location !== ''
      case 5: return formData.runTime !== ''
      default: return false
    }
  }

  const handleNext = async () => {
    if (step < 5) {
      setStep(s => s + 1)
    } else {
      setIsSignupDialogOpen(true)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (signupEmail.trim() === '' || signupPassword.length < 6) return
    setIsLoading(true)
    setErrorMsg('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail.trim(),
        password: signupPassword,
        options: {
          data: {
            name: formData.name.trim(),
            course: formData.course.trim(),
            domains: formData.domains,
            skills: formData.skills,
            location: formData.location,
            runTime: formData.runTime,
          }
        }
      })

      if (error) {
        setErrorMsg(error.message || 'Failed to create account. Please try again.')
        setIsLoading(false)
      } else {
        if (data.user) {
          // Migrate any local storage applications to DB
          await migrateLocalStorageToSupabase(data.user.id)
        }

        setIsLoading(false)
        setIsSignupDialogOpen(false)

        if (data.session) {
          setShowSuccess(true)
          setTimeout(() => router.push('/dashboard'), 800)
        } else {
          setIsVerifyingEmail(true)
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return
    setErrorMsg('')
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: signupEmail.trim(),
      })
      if (error) {
        setErrorMsg(error.message || 'Failed to resend. Please try again.')
      } else {
        setResendCooldown(60)
      }
    } catch (err) {
      setErrorMsg('Failed to resend verification email.')
    }
  }

  if (showSuccess) return <RocketLoader message="Agent Activated!" />

  if (isVerifyingEmail) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="bg-[#111111] border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/20 animate-bounce">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Verify your email</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Check your email. We sent a verification link to your email address. Click it to activate your account.
          </p>
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/25 text-xs text-destructive font-medium animate-scale-in">
              {errorMsg}
            </div>
          )}

          <div className="pt-4 flex flex-col gap-3">
            <Button
              onClick={handleResendEmail}
              disabled={resendCooldown > 0}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-xl transition-all duration-200"
            >
              {resendCooldown > 0 ? `Resend email (${resendCooldown}s)` : 'Resend email'}
            </Button>
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors pt-2"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Render ── */
  return (
    <>
      {/* Step 1 — Name & Course */}
      {step === 1 && (
        <OnboardingStep
          currentStep={1}
          totalSteps={5}
          title="What's your name and course?"
          subtitle="Let's personalise your experience."
          onNext={handleNext}
          isNextDisabled={!isStepValid()}
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm text-muted-foreground font-medium">
                Your name
              </Label>
              <Input
                id="name"
                placeholder="John Wick"
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && isStepValid() && handleNext()}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                autoComplete="name"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="course" className="text-sm text-muted-foreground font-medium">
                Your course
              </Label>
              <Input
                id="course"
                placeholder="B.Tech Computer Science"
                value={formData.course}
                onChange={e => setFormData(p => ({ ...p, course: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && isStepValid() && handleNext()}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                autoComplete="off"
              />
            </div>

            <div className="pt-4 text-center text-xs text-muted-foreground border-t border-border">
              Already have an agent active?{' '}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </div>
        </OnboardingStep>
      )}

      {/* Step 2 — Domains */}
      {step === 2 && (
        <OnboardingStep
          currentStep={2}
          totalSteps={5}
          title="Which domains interest you?"
          subtitle="Select all that apply — you can always change this later."
          onNext={handleNext}
          onBack={() => setStep(1)}
          isNextDisabled={!isStepValid()}
        >
          <div className="space-y-5">
            <BadgeGrid items={DOMAINS} field="domains" selected={formData.domains} onToggle={toggleSelection} />

            {/* Custom domain input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add your own…"
                value={customDomain}
                onChange={e => setCustomDomain(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomDomain())}
                className="h-10 bg-input border-border text-foreground placeholder:text-muted-foreground/40 rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={addCustomDomain}
                disabled={!customDomain.trim()}
                className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity hover:bg-primary/90"
                aria-label="Add custom domain"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {formData.domains.length > 0 && (
              <p className="text-xs text-primary font-medium">
                {formData.domains.length} selected
              </p>
            )}
          </div>
        </OnboardingStep>
      )}

      {/* Step 3 — Skills */}
      {step === 3 && (
        <OnboardingStep
          currentStep={3}
          totalSteps={5}
          title="What are your skills?"
          subtitle="Be honest — this helps us find accurate matches."
          onNext={handleNext}
          onBack={() => setStep(2)}
          isNextDisabled={!isStepValid()}
        >
          <div className="space-y-5">
            <BadgeGrid items={SKILLS} field="skills" selected={formData.skills} onToggle={toggleSelection} />

            <div className="flex gap-2">
              <Input
                placeholder="Add a skill…"
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                className="h-10 bg-input border-border text-foreground placeholder:text-muted-foreground/40 rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                disabled={!customSkill.trim()}
                className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity hover:bg-primary/90"
                aria-label="Add custom skill"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {formData.skills.length > 0 && (
              <p className="text-xs text-primary font-medium">
                {formData.skills.length} skill{formData.skills.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        </OnboardingStep>
      )}

      {/* Step 4 — Location */}
      {step === 4 && (
        <OnboardingStep
          currentStep={4}
          totalSteps={5}
          title="Where do you want to intern?"
          subtitle="We'll filter opportunities based on your preference."
          onNext={handleNext}
          onBack={() => setStep(3)}
          isNextDisabled={!isStepValid()}
        >
          <div className="grid grid-cols-2 gap-3">
            {LOCATIONS.map(loc => (
              <button
                key={loc.label}
                type="button"
                onClick={() => setFormData(p => ({ ...p, location: loc.label }))}
                className={cn(
                  'flex flex-col items-center gap-2 p-5 rounded-xl border-2 text-center',
                  'transition-all duration-200 cursor-pointer',
                  formData.location === loc.label
                    ? 'bg-primary/10 border-primary text-foreground shadow-lg shadow-primary/10'
                    : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-card/80'
                )}
              >
                <span className="text-2xl">{loc.emoji}</span>
                <span className="text-sm font-medium">{loc.label}</span>
              </button>
            ))}
          </div>
        </OnboardingStep>
      )}

      {/* Step 5 — Run Time */}
      {step === 5 && (
        <OnboardingStep
          currentStep={5}
          totalSteps={5}
          title="When should your agent run?"
          subtitle="Your agent will hunt for internships at this time every day."
          onNext={handleNext}
          onBack={() => setStep(4)}
          isNextDisabled={!isStepValid()}
          nextLabel="Activate Agent"
        >
          <div className="space-y-4">
            {isMounted ? (
              <ThemeProvider
                theme={createTheme({
                  palette: {
                    mode: 'dark',
                    primary: { main: '#7c3aed' },
                    background: {
                      default: '#111111',
                      paper: '#111111',
                    },
                  },
                  components: {
                    MuiPickersLayout: {
                      styleOverrides: {
                        root: {
                          backgroundColor: '#111111',
                          color: '#ffffff',
                          borderRadius: '16px',
                          border: '1px solid hsl(var(--border))',
                          overflow: 'hidden',
                        }
                      }
                    },
                    MuiPickersToolbar: {
                      styleOverrides: {
                        root: {
                          backgroundColor: '#111111',
                        }
                      }
                    },
                    MuiDialogActions: {
                      styleOverrides: {
                        root: {
                          display: 'none',
                        }
                      }
                    }
                  }
                })}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticTimePicker
                    orientation="landscape"
                    value={formData.runTime ? dayjs(`2000-01-01T${formData.runTime}`) : dayjs('2000-01-01T09:00')}
                    onChange={(newVal: Dayjs | null) => {
                      if (newVal && newVal.isValid()) {
                        const hh = String(newVal.hour()).padStart(2, '0')
                        const mm = String(newVal.minute()).padStart(2, '0')
                        setFormData(p => ({ ...p, runTime: `${hh}:${mm}` }))
                      }
                    }}
                    slotProps={{
                      actionBar: { actions: [] },
                    }}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            ) : (
              <div className="h-[200px] w-full bg-input border border-border rounded-xl animate-pulse" />
            )}

            <p className="text-xs text-muted-foreground/60">
              Pro tip: Evening times (9–10 PM) tend to show the freshest listings.
            </p>
          </div>
        </OnboardingStep>
      )}

      {/* Dialog for Account Creation & Activation */}
      <Dialog open={isSignupDialogOpen} onOpenChange={setIsSignupDialogOpen}>
        <DialogContent className="sm:max-w-[400px] border-border bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md shadow-violet-500/25">
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </span>
              Create agent account
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1.5">
              Secure your profile and access your hunt from any device.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSignup} className="space-y-4 pt-2">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/25 text-xs text-destructive font-medium animate-scale-in">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="signup-email" className="text-xs text-muted-foreground font-medium">
                Email address
              </Label>
              <Input
                id="signup-email"
                type="email"
                required
                placeholder="you@college.edu.in"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                className="h-11 bg-input border-border text-foreground placeholder:text-muted-foreground/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="signup-password" className="text-xs text-muted-foreground font-medium">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                required
                placeholder="Min. 6 characters"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                className="h-11 bg-input border-border text-foreground placeholder:text-muted-foreground/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                autoComplete="new-password"
              />
            </div>

            <p className="text-[10px] text-muted-foreground/50 leading-normal">
              By clicking Activate Agent, your agent will run on schedule in the cloud matching listings to your profile.
            </p>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={isLoading || signupEmail.trim() === '' || signupPassword.length < 6}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-xl gap-2 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Spinner size={16} color="var(--primary-foreground)" />
                    <span>Activating agent...</span>
                  </>
                ) : (
                  <>
                    <span>Activate Agent 🚀</span>
                  </>
                )}
              </Button>
            </DialogFooter>

            <div className="pt-4 text-center text-xs text-muted-foreground border-t border-border">
              Already have an agent active?{' '}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </>
  )
}
