'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Zap,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  X,
  Shield,
  Clock,
  Sparkles,
  User,
  Info
} from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

type AuthView = 'login' | 'signup' | 'forgot' | 'resend' | 'recovery' | 'verification-pending'

export default function LoginPage() {
  const router = useRouter()
  const { isLoggedIn, loading: authLoading } = useUser()

  // Views & Inputs
  const [view, setView] = useState<AuthView>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // Password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Status & Logic states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNoAccountDialog, setShowNoAccountDialog] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const [isResetLinkSent, setIsResetLinkSent] = useState(false)

  // Password requirements focus state
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  // Security: rate-limiting failed logins
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState(0)

  // Security: resend verification link cooldown
  const [resendCooldown, setResendCooldown] = useState(0)

  // Load "Remember Me" email on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedEmail = localStorage.getItem('internhunt_remember_me_email')
    if (savedEmail) {
      setTimeout(() => {
        setEmail(savedEmail)
        setRememberMe(true)
      }, 0)
    }
  }, [])

  // Load lockout and resend cooldown from storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Lockout
    const lockoutExpiry = sessionStorage.getItem('internhunt_lockout_expiry')
    if (lockoutExpiry) {
      const remaining = Math.ceil((parseInt(lockoutExpiry) - Date.now()) / 1000)
      if (remaining > 0) {
        setTimeout(() => {
          setLockoutTime(remaining)
        }, 0)
      }
    }

    // Cooldown
    const cooldownExpiry = localStorage.getItem('internhunt_resend_cooldown')
    if (cooldownExpiry) {
      const remaining = Math.ceil((parseInt(cooldownExpiry) - Date.now()) / 1000)
      if (remaining > 0) {
        setTimeout(() => {
          setResendCooldown(remaining)
        }, 0)
      }
    }
  }, [])

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTime <= 0) return
    const timer = setInterval(() => {
      setLockoutTime(prev => {
        if (prev <= 1) {
          sessionStorage.removeItem('internhunt_lockout_expiry')
          setFailedAttempts(0)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [lockoutTime])

  // Resend Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          localStorage.removeItem('internhunt_resend_cooldown')
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Handle detecting password recovery token from hash or URL query parameters
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    if (params.get('type') === 'recovery') {
      setTimeout(() => setView('recovery'), 0)
      return
    }

    const hash = window.location.hash
    if (hash && (hash.includes('type=recovery') || hash.includes('recovery'))) {
      setTimeout(() => setView('recovery'), 0)
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setTimeout(() => setView('recovery'), 0)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Redirect to dashboard if logged in (and not on recovery view)
  useEffect(() => {
    if (!authLoading && isLoggedIn && view !== 'recovery') {
      router.push('/dashboard')
    }
  }, [isLoggedIn, authLoading, router, view])

  // Password criteria checker
  const checkPasswordStrength = (pass: string) => {
    const requirements = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass),
    }

    const score = Object.values(requirements).filter(Boolean).length

    return {
      requirements,
      score,
      label: score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong',
      color: score <= 2 ? 'bg-rose-500' : score <= 4 ? 'bg-amber-500' : 'bg-emerald-500',
      percent: (score / 5) * 100,
      isValid: score === 5
    }
  };

  const strength = checkPasswordStrength(password)

  // Shake trigger
  const triggerShake = () => {
    setShakeKey(prev => prev + 1)
  }

  // Handle failed login security counter
  const handleFailedAttempt = () => {
    const newAttempts = failedAttempts + 1
    setFailedAttempts(newAttempts)
    if (newAttempts >= 5) {
      const expiry = Date.now() + 60000 // 60 seconds
      sessionStorage.setItem('internhunt_lockout_expiry', expiry.toString())
      setLockoutTime(60)
      toast.error('Too many failed attempts. Account login locked for 60 seconds.')
    }
  }

  // Handle email verification resend limits
  const startResendCooldown = () => {
    const expiry = Date.now() + 60000 // 60 seconds
    localStorage.setItem('internhunt_resend_cooldown', expiry.toString())
    setResendCooldown(60)
  }

  // View state switcher helper
  const changeView = (newView: AuthView) => {
    setView(newView)
    setIsResetLinkSent(false)
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  // 1. SIGN IN FLOW
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    if (lockoutTime > 0) {
      toast.warning(`Please wait ${lockoutTime} seconds before trying again.`)
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        const errorMsg = error.message.toLowerCase()

        if (errorMsg.includes('confirm') || errorMsg.includes('verify')) {
          // Case 4: Email not verified
          setView('verification-pending')
          toast.error('Email not verified. Please check your inbox.')
        } else if (errorMsg.includes('invalid') || errorMsg.includes('credentials')) {
          // Check if profile exists to determine if they ever signed up
          const { data: profileData } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', email.trim())
            .maybeSingle()

          if (!profileData) {
            // Case 3: Account does not exist
            setShowNoAccountDialog(true)
          } else {
            // Case 2: Incorrect password for active account
            triggerShake()
            toast.error('Incorrect password. Please try again.')
            handleFailedAttempt()
          }
        } else {
          // Other generic failures
          triggerShake()
          toast.error(error.message || 'Invalid email or password.')
          handleFailedAttempt()
        }
      } else {
        // Case 1: Successful login
        if (rememberMe) {
          localStorage.setItem('internhunt_remember_me_email', email.trim())
        } else {
          localStorage.removeItem('internhunt_remember_me_email')
        }
        toast.success('Successfully logged in!')
        router.push('/dashboard')
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 2. SIGN UP FLOW
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) return

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    if (!strength.isValid) {
      toast.error('Password does not meet the safety requirements.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            name: fullName.trim(),
            course: 'Self-signup',
            domains: [],
            skills: [],
            location: '',
            runTime: '09:00',
          },
          emailRedirectTo: `${window.location.origin}/login`,
        }
      })

      if (error) {
        toast.error(error.message || 'Failed to sign up. Please try again.')
      } else {
        if (data.session) {
          toast.success('Successfully registered and logged in!')
          router.push('/dashboard')
        } else {
          toast.success('Account created! Verification link sent to your email.')
          setView('verification-pending')
        }
      }
    } catch (err) {
      toast.error('An unexpected error occurred during signup.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 3. FORGOT PASSWORD FLOW
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    if (resendCooldown > 0) {
      toast.warning(`Please wait ${resendCooldown}s to request another reset link.`)
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login?type=recovery`,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Reset link sent! Check your inbox.')
        startResendCooldown()
        setIsResetLinkSent(true)
      }
    } catch (err) {
      toast.error('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 4. RESET PASSWORD FLOW (RECOVERY)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim() || !confirmPassword.trim()) return

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    if (!strength.isValid) {
      toast.error('Password does not meet the safety requirements.')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password.trim(),
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Password updated successfully! Redirecting you...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch (err) {
      toast.error('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 5. RESEND VERIFICATION EMAIL FLOW
  const handleResendVerification = async (e: React.FormEvent) => {
    e?.preventDefault()
    if (!email.trim()) return

    if (resendCooldown > 0) {
      toast.warning(`Please wait ${resendCooldown}s before requesting a new code.`)
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Verification link resent successfully!')
        startResendCooldown()
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || (isLoggedIn && !isSubmitting && view !== 'recovery')) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Spinner size={24} />
      </div>
    )
  }

  // Set card descriptions based on state
  const getHeaderInfo = () => {
    switch (view) {
      case 'login':
        return {
          title: 'Sign In to InternHunt',
          subtitle: 'Welcome back! Let your agent continue the hunt.',
        }
      case 'signup':
        return {
          title: 'Create Your Agent Account',
          subtitle: 'Set up an automated agent to hunt internships.',
        }
      case 'forgot':
        return {
          title: isResetLinkSent ? 'Check Your Inbox' : 'Recover Your Password',
          subtitle: isResetLinkSent ? 'Password reset link has been sent.' : "We'll send you a secure link to update credentials.",
        }
      case 'resend':
        return {
          title: 'Resend Verification',
          subtitle: 'Get a new activation link sent to your inbox.',
        }
      case 'verification-pending':
        return {
          title: 'Verification Link Sent',
          subtitle: `Please verify your email address to active your agent.`,
        }
      case 'recovery':
        return {
          title: 'Enter New Password',
          subtitle: 'Set a secure password for your account.',
        }
    }
  }

  const header = getHeaderInfo()

  return (
    <main className="relative min-h-screen bg-[#060608] flex items-center justify-center p-4 sm:p-6 overflow-hidden md:p-0">
      {/* Dynamic Background Glow Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[140px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/8 rounded-full blur-[140px]" />
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015] bg-grid"
        aria-hidden="true"
      />

      {/* Main Interface Card */}
      <div className="relative w-full max-w-[440px] bg-card/45 border border-border/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl p-6 sm:p-10 min-h-[580px] h-auto flex flex-col justify-center">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center mb-6">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
              <Zap className="w-5 h-5 text-white fill-white/10" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Intern<span className="text-violet-400">Hunt</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto">
            {/* View Title Header */}
            <div className="mb-6">
              <h1 className="text-[20px] font-bold text-white tracking-tight leading-tight flex items-center gap-2">
                {header.title}
              </h1>
              <p className="text-[12px] text-white/45 mt-1.5 leading-relaxed">
                {header.subtitle}
              </p>
            </div>

            {/* Framer motion wrapper for layout height resizing */}
            <motion.div
              layout
              key={shakeKey}
              animate={shakeKey > 0 ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <AnimatePresence mode="wait">
                
                {/* 1. SIGN IN VIEW */}
                {view === 'login' && (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    {/* Email field */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-[11px] font-medium text-white/50 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        disabled={lockoutTime > 0 || isSubmitting}
                        placeholder="you@college.edu.in"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="h-10 bg-[#0e0e11] border-border/80 text-white rounded-xl focus-visible:ring-violet-500/40 text-xs"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>

                    {/* Password field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-[11px] font-medium text-white/50 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          Password
                        </Label>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          disabled={lockoutTime > 0 || isSubmitting}
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="h-10 bg-[#0e0e11] border-border/80 text-white rounded-xl focus-visible:ring-violet-500/40 text-xs pr-10"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(p => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-right pt-0.5">
                        <button
                          type="button"
                          onClick={() => changeView('forgot')}
                          className="text-[11px] text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </div>

                    {/* Remember me & Security details */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-white/50 text-[11px] cursor-pointer hover:text-white/70 select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 bg-input border-border/80 rounded accent-violet-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <span>Remember email</span>
                      </label>
                      <span className="text-[10px] text-white/25 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-violet-500/40" />
                        Secure login
                      </span>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting || lockoutTime > 0}
                      className="w-full h-10.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl gap-2 mt-2 transition-all hover:opacity-95 shadow-md shadow-violet-500/10 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size={15} color="#ffffff" />
                          <span>Signing in...</span>
                        </>
                      ) : lockoutTime > 0 ? (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Locked ({lockoutTime}s)</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    {/* Footer toggles */}
                    <div className="space-y-2.5 text-center mt-3 pt-3 border-t border-white/[0.04]">
                      <div className="text-[11px] text-white/45">
                        New to InternHunt?{' '}
                        <button
                          type="button"
                          onClick={() => changeView('signup')}
                          className="text-violet-400 hover:text-violet-300 font-semibold hover:underline"
                        >
                          Create Account
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => changeView('resend')}
                          className="text-[10px] text-white/35 hover:text-white/60 hover:underline transition-colors"
                        >
                          Did not get a verification link? Resend
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}

                {/* 2. SIGN UP VIEW */}
                {view === 'signup' && (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSignup}
                    className="space-y-4"
                  >
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fullname" className="text-[11px] font-medium text-white/50 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        Full Name
                      </Label>
                      <Input
                        id="fullname"
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder="John Doe"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="h-10 bg-[#0e0e11] border-border/80 text-white rounded-xl focus-visible:ring-violet-500/40 text-xs"
                        autoFocus
                      />
                    </div>

                    {/* Email address */}
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email-input" className="text-[11px] font-medium text-white/50 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Email Address
                      </Label>
                      <Input
                        id="signup-email-input"
                        type="email"
                        required
                        disabled={isSubmitting}
                        placeholder="john@college.edu.in"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="h-10 bg-[#0e0e11] border-border/80 text-white rounded-xl focus-visible:ring-violet-500/40 text-xs"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password-input" className="text-[11px] font-medium text-white/50 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password-input"
                          type={showPassword ? 'text' : 'password'}
                          required
                          disabled={isSubmitting}
                          placeholder="••••••••"
                          value={password}
                          onFocus={() => setIsPasswordFocused(true)}
                          onBlur={() => setIsPasswordFocused(false)}
                          onChange={e => setPassword(e.target.value)}
                          className="h-10 bg-[#0e0e11] border-border/80 text-white rounded-xl focus-visible:ring-violet-500/40 text-xs pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(p => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password strength visual meter */}
                      {password && (
                        <div className="space-y-1 pt-1.5 animate-scale-in">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-white/40">Password strength:</span>
                            <span className={cn('font-bold',
                              strength.score <= 2 ? 'text-rose-400' : strength.score <= 4 ? 'text-amber-400' : 'text-emerald-400'
                            )}>
                              {strength.label}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                            <div
                              className={cn('h-full transition-all duration-300', strength.color)}
                              style={{ width: `${strength.percent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-confirm-password-input" className="text-[11px] font-medium text-white/50 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-confirm-password-input"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          disabled={isSubmitting}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="h-10 bg-[#0e0e11] border-border/80 text-white rounded-xl focus-visible:ring-violet-500/40 text-xs pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(p => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Password requirements checker checklist (always show when writing password, or when focused) */}
                    {(isPasswordFocused || password) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-xl space-y-2 text-[10px]"
                      >
                        <span className="font-semibold text-white/50 block mb-1">Safety Checklist:</span>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono">
                          <div className="flex items-center gap-1.5">
                            {strength.requirements.length ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3 h-3 text-white/20 shrink-0" />
                            )}
                            <span className={strength.requirements.length ? 'text-emerald-400/80' : 'text-white/30'}>8+ characters</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {strength.requirements.uppercase ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3 h-3 text-white/20 shrink-0" />
                            )}
                            <span className={strength.requirements.uppercase ? 'text-emerald-400/80' : 'text-white/30'}>1+ Uppercase</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {strength.requirements.lowercase ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3 h-3 text-white/20 shrink-0" />
                            )}
                            <span className={strength.requirements.lowercase ? 'text-emerald-400/80' : 'text-white/30'}>1+ Lowercase</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {strength.requirements.number ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3 h-3 text-white/20 shrink-0" />
                            )}
                            <span className={strength.requirements.number ? 'text-emerald-400/80' : 'text-white/30'}>1+ Number</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {strength.requirements.special ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3 h-3 text-white/20 shrink-0" />
                            )}
                            <span className={strength.requirements.special ? 'text-emerald-400/80' : 'text-white/30'}>1+ Special char</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting || !strength.isValid || confirmPassword !== password}
                      className="w-full h-10.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl gap-2 mt-2 transition-all hover:opacity-95 shadow-md shadow-violet-500/10 cursor-pointer disabled:opacity-40"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size={15} color="#ffffff" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Agent Account 🚀</span>
                        </>
                      )}
                    </Button>

                    <div className="text-center mt-3 pt-3 border-t border-white/[0.04] text-[11px] text-white/45">
                      Already have an agent active?{' '}
                      <button
                        type="button"
                        onClick={() => changeView('login')}
                        className="text-violet-400 hover:text-violet-300 font-semibold hover:underline"
                      >
                        Sign In
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* 3. FORGOT PASSWORD VIEW */}
                {view === 'forgot' && (
                  <AnimatePresence mode="wait">
                    {!isResetLinkSent ? (
                      <motion.form
                        key="forgot-form"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={handleForgotPassword}
                        className="space-y-4"
                      >
                        <div className="space-y-1.5">
                          <Label htmlFor="forgot-email" className="text-[11px] font-medium text-white/50 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            Email Address
                          </Label>
                          <Input
                            id="forgot-email"
                            type="email"
                            required
                            disabled={isSubmitting}
                            placeholder="you@college.edu.in"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="h-10 bg-[#0e0e11] border-border/80 text-white rounded-xl focus-visible:ring-violet-500/40 text-xs"
                            autoComplete="email"
                            autoFocus
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-10.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl gap-2 mt-2 transition-all hover:opacity-95 shadow-md shadow-violet-500/10 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <Spinner size={15} color="#ffffff" />
                              <span>Sending Reset Link...</span>
                            </>
                          ) : (
                            <>
                              <span>Send reset link</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </Button>

                        <button
                          type="button"
                          onClick={() => changeView('login')}
                          className="w-full h-10 border border-border/80 text-white/50 hover:text-white hover:bg-white/[0.04] font-medium rounded-xl gap-2 flex items-center justify-center transition-all text-xs cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to login</span>
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="forgot-success"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5 text-center"
                      >
                        <div className="flex justify-center py-2">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-60" />
                            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-400">
                              <CheckCircle2 className="h-6.5 w-6.5" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h2 className="text-sm font-semibold text-white tracking-tight">Reset link sent. Check your inbox.</h2>
                          <p className="text-[11px] text-white/40 max-w-xs mx-auto leading-relaxed">
                            We sent a password reset link to <strong className="text-white">{email}</strong>. Please check your inbox or spam folder.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => changeView('login')}
                          className="w-full h-10 border border-border/80 text-white/50 hover:text-white hover:bg-white/[0.04] font-medium rounded-xl gap-2 flex items-center justify-center transition-all text-xs cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to login</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* 4. RESEND VERIFICATION EMAIL VIEW */}
                {view === 'resend' && (
                  <motion.form
                    key="resend"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleResendVerification}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="resend-email" className="text-[11px] font-medium text-white/50 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Email Address
                      </Label>
                      <Input
                        id="resend-email"
                        type="email"
                        required
                        disabled={isSubmitting}
                        placeholder="you@college.edu.in"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="h-10 bg-[#0e0e11] border-border/80 text-white rounded-xl focus-visible:ring-violet-500/40 text-xs"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || resendCooldown > 0}
                      className="w-full h-10.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl gap-2 mt-2 transition-all hover:opacity-95 shadow-md shadow-violet-500/10 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size={15} color="#ffffff" />
                          <span>Resending...</span>
                        </>
                      ) : resendCooldown > 0 ? (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Resend in {resendCooldown}s</span>
                        </>
                      ) : (
                        <>
                          <span>Resend Verification Link</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={() => changeView('login')}
                      className="w-full h-10 border border-border/80 text-white/50 hover:text-white hover:bg-white/[0.04] font-medium rounded-xl gap-2 flex items-center justify-center transition-all text-xs cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Sign In</span>
                    </button>
                  </motion.form>
                )}

                {/* 5. VERIFICATION PENDING STATE VIEW */}
                {view === 'verification-pending' && (
                  <motion.div
                    key="verification-pending"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 text-center"
                  >
                    <div className="flex justify-center py-4">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-violet-500/10 animate-ping opacity-60" />
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10 border border-violet-500/35 text-violet-400">
                          <Mail className="h-6.5 w-6.5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-white/80 font-medium leading-relaxed">
                        We have sent a verification or recovery link to:
                      </p>
                      <p className="text-sm font-semibold text-white tracking-tight">
                        {email}
                      </p>
                      <p className="text-[11px] text-white/40 max-w-xs mx-auto leading-relaxed pt-1.5">
                        Please check your spam or promotions inbox if you do not see it in 2 minutes. Click the link to complete authentication.
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-white/[0.04]">
                      <Button
                        onClick={handleResendVerification}
                        disabled={isSubmitting || resendCooldown > 0}
                        className="w-full h-10 bg-white/5 hover:bg-white/10 text-white border border-white/[0.06] font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <Spinner size={14} color="#ffffff" />
                        ) : resendCooldown > 0 ? (
                          <>
                            <Clock className="w-3.5 h-3.5 text-white/40" />
                            <span>Resend link in {resendCooldown}s</span>
                          </>
                        ) : (
                          <>
                            <span>Resend Link</span>
                          </>
                        )}
                      </Button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => changeView('signup')}
                          className="flex-1 h-9 border border-border/80 hover:bg-white/[0.04] text-white/60 hover:text-white rounded-xl text-[10px] font-medium transition-all"
                        >
                          Change Email
                        </button>
                        <button
                          onClick={() => changeView('login')}
                          className="flex-1 h-9 border border-border/80 hover:bg-white/[0.04] text-white/60 hover:text-white rounded-xl text-[10px] font-medium transition-all"
                        >
                          Back to Sign In
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 6. RESET PASSWORD RECOVERY STATE */}
                {view === 'recovery' && (
                  <motion.form
                    key="recovery"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleUpdatePassword}
                    className="space-y-4"
                  >
                    {/* New Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="recovery-password" className="text-[11px] font-medium text-white/50 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="recovery-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          disabled={isSubmitting}
                          placeholder="••••••••"
                          value={password}
                          onFocus={() => setIsPasswordFocused(true)}
                          onBlur={() => setIsPasswordFocused(false)}
                          onChange={e => setPassword(e.target.value)}
                          className="h-10 bg-[#0e0e11] border-border/80 text-white rounded-xl focus-visible:ring-violet-500/40 text-xs pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(p => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password strength */}
                      {password && (
                        <div className="space-y-1 pt-1.5 animate-scale-in">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-white/40">Password strength:</span>
                            <span className={cn('font-bold',
                              strength.score <= 2 ? 'text-rose-400' : strength.score <= 4 ? 'text-amber-400' : 'text-emerald-400'
                            )}>
                              {strength.label}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
                            <div
                              className={cn('h-full transition-all duration-300', strength.color)}
                              style={{ width: `${strength.percent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="recovery-confirm-password" className="text-[11px] font-medium text-white/50 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="recovery-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          disabled={isSubmitting}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="h-10 bg-[#0e0e11] border-border/80 text-white rounded-xl focus-visible:ring-violet-500/40 text-xs pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(p => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Password requirements checker checklist */}
                    {(isPasswordFocused || password) && (
                      <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-xl space-y-2 text-[10px]">
                        <span className="font-semibold text-white/50 block mb-1">Safety Checklist:</span>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono">
                          <div className="flex items-center gap-1.5">
                            {strength.requirements.length ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3 h-3 text-white/20 shrink-0" />
                            )}
                            <span className={strength.requirements.length ? 'text-emerald-400/80' : 'text-white/30'}>8+ characters</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {strength.requirements.uppercase ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3 h-3 text-white/20 shrink-0" />
                            )}
                            <span className={strength.requirements.uppercase ? 'text-emerald-400/80' : 'text-white/30'}>1+ Uppercase</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {strength.requirements.lowercase ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3 h-3 text-white/20 shrink-0" />
                            )}
                            <span className={strength.requirements.lowercase ? 'text-emerald-400/80' : 'text-white/30'}>1+ Lowercase</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {strength.requirements.number ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3 h-3 text-white/20 shrink-0" />
                            )}
                            <span className={strength.requirements.number ? 'text-emerald-400/80' : 'text-white/30'}>1+ Number</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {strength.requirements.special ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <X className="w-3 h-3 text-white/20 shrink-0" />
                            )}
                            <span className={strength.requirements.special ? 'text-emerald-400/80' : 'text-white/30'}>1+ Special char</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting || !strength.isValid || confirmPassword !== password}
                      className="w-full h-10.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl gap-2 mt-2 transition-all hover:opacity-95 shadow-md shadow-violet-500/10 cursor-pointer disabled:opacity-40"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size={15} color="#ffffff" />
                          <span>Updating password...</span>
                        </>
                      ) : (
                        <>
                          <span>Update Password</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}

              </AnimatePresence>
            </motion.div>

            {/* Bottom Footer Info */}
            <div className="mt-8 text-center text-[10px] text-white/20 leading-relaxed max-w-xs mx-auto">
              Having trouble logging in? Contact{' '}
              <a href="mailto:support@internhunt.in" className="hover:text-white/40 transition-colors font-medium underline">
                support@internhunt.in
              </a>
              <br />
              © 2026 InternHunt. All rights reserved.
            </div>

          </div>

      </div>

      {/* Case 3: Radix UI Account Not Found Dialog */}
      <Dialog open={showNoAccountDialog} onOpenChange={setShowNoAccountDialog}>
        <DialogContent className="bg-[#0b0b0e]/95 border-border/80 shadow-[0_0_50px_-12px_rgba(124,58,237,0.35)] backdrop-blur-xl sm:max-w-[420px] rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-500" />
          
          <div className="flex flex-col items-center text-center mt-3">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-violet-500/10 animate-ping opacity-75" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-violet-500/10 to-violet-500/20 border border-violet-500/30 text-violet-400">
                <Info className="h-6.5 w-6.5 text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]" strokeWidth={2} />
              </div>
            </div>

            <DialogHeader className="space-y-2">
              <DialogTitle className="text-lg font-bold text-white tracking-tight">
                No Active Agent Found
              </DialogTitle>
              <DialogDescription className="text-xs text-white/50 leading-relaxed max-w-sm">
                We couldn&apos;t find an active account with the email <strong className="text-white">{email}</strong>. 
                In order to set up your AI hunting agent, you must first create an account.
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-col sm:justify-stretch mt-6">
            <Button
              onClick={() => {
                setShowNoAccountDialog(false)
                changeView('signup')
              }}
              className="w-full h-10.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <button
              onClick={() => setShowNoAccountDialog(false)}
              className="w-full h-10.5 border border-border/80 hover:bg-white/5 text-white/50 hover:text-white font-medium rounded-xl transition-all text-xs cursor-pointer"
            >
              Try Another Email
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
  )
}
