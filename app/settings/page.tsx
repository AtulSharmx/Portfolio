'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/internhunt/nav-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  User, Zap, Bell, Check, Clock, LogOut, Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import { Spinner } from '@/components/ui/spinner'
import { SkillBadge } from '@/components/internhunt/skill-badge'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'
import { createTheme, ThemeProvider } from '@mui/material/styles'

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

/* ── Section wrapper ── */
function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: React.ElementType
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('animate-fade-up', className)}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {title}
          </h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="bg-card border rounded-2xl overflow-hidden border-border">
        {children}
      </div>
    </section>
  )
}

/* ── Setting row ── */
function SettingRow({
  label,
  description,
  control,
  noBorder,
}: {
  label: string
  description?: string
  control: React.ReactNode
  noBorder?: boolean
}) {
  return (
    <div className={cn(
      'flex items-center justify-between gap-4 px-5 py-4',
      !noBorder && 'border-b border-border last:border-b-0'
    )}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{control}</div>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, userId, loading, updateUser, logout } = useUser()

  const [formData, setFormData] = useState({
    name: '',
    course: '',
    email: '',
    domains: [] as string[],
    skills: [] as string[],
    location: '',
    runTime: '',
    isActive: true,
    emailNotifications: true,
    pushNotifications: false,
  })

  const [customDomain, setCustomDomain] = useState('')
  const [customSkill, setCustomSkill] = useState('')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [isMounted, setIsMounted] = useState(false)

  const hasInteractedRef = useRef(false)

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0)
  }, [])

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user && !isLoggingOut) {
      router.push('/onboarding')
    }
  }, [user, loading, router, isLoggingOut])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    router.replace('/')
  }

  // Load user data on mount / initial sign-in
  const [prevUserId, setPrevUserId] = useState<string | null>(null)
  if (userId && user && userId !== prevUserId) {
    setPrevUserId(userId)
    setFormData({
      name: user.name || '',
      course: user.course || '',
      email: user.email || '',
      domains: user.domains || [],
      skills: user.skills || [],
      location: user.location || 'Remote',
      runTime: user.runTime || '09:00',
      isActive: user.isActive ?? true,
      emailNotifications: user.emailNotifications ?? true,
      pushNotifications: user.pushNotifications ?? false,
    })
  }

  const updateField = (field: string, value: any) => {
    hasInteractedRef.current = true
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSelection = useCallback((field: 'domains' | 'skills', value: string) => {
    hasInteractedRef.current = true
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
      hasInteractedRef.current = true
      setFormData(p => ({ ...p, domains: [...p.domains, v] }))
      setCustomDomain('')
    }
  }, [customDomain, formData.domains])

  const addCustomSkill = useCallback(() => {
    const v = customSkill.trim()
    if (v && !formData.skills.includes(v)) {
      hasInteractedRef.current = true
      setFormData(p => ({ ...p, skills: [...p.skills, v] }))
      setCustomSkill('')
    }
  }, [customSkill, formData.skills])

  // Debounced auto-save effect
  useEffect(() => {
    if (!userId || !user) return
    if (!hasInteractedRef.current) return

    setSaveStatus('saving')
    const timer = setTimeout(async () => {
      try {
        await updateUser({
          name: formData.name,
          course: formData.course,
          email: formData.email,
          domains: formData.domains,
          skills: formData.skills,
          location: formData.location,
          runTime: formData.runTime,
          isActive: formData.isActive,
          emailNotifications: formData.emailNotifications,
          pushNotifications: formData.pushNotifications,
        })
        setSaveStatus('saved')
      } catch (err) {
        console.error('Failed to auto-save settings:', err)
        setSaveStatus('idle')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [formData, userId, updateUser, user])

  // Reset saved status after delay
  useEffect(() => {
    if (saveStatus === 'saved') {
      const t = setTimeout(() => {
        setSaveStatus('idle')
      }, 2200)
      return () => clearTimeout(t)
    }
  }, [saveStatus])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size={24} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row pb-12">
      <NavBar />

      <main className="flex-1 pb-24 md:pb-0 min-w-0">
        <div className="max-w-2xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-8 animate-fade-up">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your profile and agent preferences.
              </p>
            </div>

            {/* Subtle auto-save status indicator in the top right */}
            <div className="flex items-center gap-2 h-10">
              {saveStatus === 'saving' && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
                  <Spinner size={12} />
                  <span>Saving...</span>
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-1 text-xs text-emerald-500 font-semibold animate-scale-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Profile details ── */}
          <SettingsSection icon={User} title="Profile" description="Your personal details">
            {/* Avatar strip */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-border bg-muted/20">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/30 to-purple-600/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-primary/80">
                  {formData.name ? formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{formData.name || 'Anonymous Student'}</p>
                <p className="text-xs text-muted-foreground">{formData.course || 'Unspecified Course'}</p>
              </div>
            </div>

            {/* Fields */}
            <div className="px-5 py-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs text-muted-foreground font-medium">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  className="h-11 bg-input border-border text-foreground rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="course" className="text-xs text-muted-foreground font-medium">Course</Label>
                <Input
                  id="course"
                  type="text"
                  placeholder="B.Tech CS"
                  value={formData.course}
                  onChange={e => updateField('course', e.target.value)}
                  className="h-11 bg-input border-border text-foreground rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  disabled
                  className="h-11 bg-input border-border text-foreground/50 rounded-xl cursor-not-allowed opacity-75"
                />
              </div>
            </div>
          </SettingsSection>

          {/* ── Interests & Skills ── */}
          <SettingsSection icon={Zap} title="Interests & Skills" description="Customize your job matching criteria">
            <div className="px-5 py-4 space-y-6">
              {/* Domains of Interest */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground font-medium">Domains of Interest</Label>
                <div className="flex flex-wrap gap-2.5">
                  {DOMAINS.map(item => (
                    <SkillBadge
                      key={item}
                      skill={item}
                      selected={formData.domains.includes(item)}
                      onClick={() => toggleSelection('domains', item)}
                    />
                  ))}
                  {formData.domains.filter(s => !DOMAINS.includes(s)).map(item => (
                    <SkillBadge
                      key={item}
                      skill={item}
                      selected
                      onClick={() => toggleSelection('domains', item)}
                    />
                  ))}
                </div>
                <div className="flex gap-2 max-w-md">
                  <Input
                    placeholder="Add custom domain..."
                    value={customDomain}
                    onChange={e => setCustomDomain(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomDomain())}
                    className="h-10 bg-input border-border text-foreground rounded-xl text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCustomDomain}
                    disabled={!customDomain.trim()}
                    className="h-10 w-10 p-0 rounded-xl bg-primary text-primary-foreground border-0 hover:bg-primary/90 flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground font-medium">Skills</Label>
                <div className="flex flex-wrap gap-2.5">
                  {SKILLS.map(item => (
                    <SkillBadge
                      key={item}
                      skill={item}
                      selected={formData.skills.includes(item)}
                      onClick={() => toggleSelection('skills', item)}
                    />
                  ))}
                  {formData.skills.filter(s => !SKILLS.includes(s)).map(item => (
                    <SkillBadge
                      key={item}
                      skill={item}
                      selected
                      onClick={() => toggleSelection('skills', item)}
                    />
                  ))}
                </div>
                <div className="flex gap-2 max-w-md">
                  <Input
                    placeholder="Add custom skill..."
                    value={customSkill}
                    onChange={e => setCustomSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                    className="h-10 bg-input border-border text-foreground rounded-xl text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCustomSkill}
                    disabled={!customSkill.trim()}
                    className="h-10 w-10 p-0 rounded-xl bg-primary text-primary-foreground border-0 hover:bg-primary/90 flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* ── Location Preference ── */}
          <SettingsSection icon={Zap} title="Location Preference" description="Where do you want to intern?">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5">
              {LOCATIONS.map(loc => (
                <button
                  key={loc.label}
                  type="button"
                  onClick={() => updateField('location', loc.label)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center',
                    'transition-all duration-200 cursor-pointer',
                    formData.location === loc.label
                      ? 'bg-primary/10 border-primary text-foreground shadow-lg shadow-primary/10'
                      : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-card/80'
                  )}
                >
                  <span className="text-xl">{loc.emoji}</span>
                  <span className="text-xs font-semibold">{loc.label}</span>
                </button>
              ))}
            </div>
          </SettingsSection>

          {/* ── Agent settings ── */}
          <SettingsSection icon={Zap} title="Agent" description="Control your hunting agent">
            <SettingRow
              label="Agent Status"
              description={formData.isActive ? 'Hunting daily at the selected time' : 'Agent is paused'}
              control={
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={v => updateField('isActive', v)}
                />
              }
            />

            {/* Run time Static Picker */}
            <div className="px-5 py-4 border-b border-border last:border-b-0">
              <Label className="text-xs text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Daily run time
              </Label>
              <div className="pt-2">
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
                            updateField('runTime', `${hh}:${mm}`)
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
              </div>
            </div>
          </SettingsSection>

          {/* ── Notifications ── */}
          <SettingsSection icon={Bell} title="Notifications">
            <SettingRow
              label="Email summaries"
              description="Daily match digest in your inbox"
              control={
                <Switch
                  checked={formData.emailNotifications}
                  onCheckedChange={v => updateField('emailNotifications', v)}
                />
              }
            />
            <SettingRow
              label="Push notifications"
              description="Instant alert when new matches appear"
              noBorder
              control={
                <Switch
                  checked={formData.pushNotifications}
                  onCheckedChange={v => updateField('pushNotifications', v)}
                />
              }
            />
          </SettingsSection>

          {/* ── Bottom log out ── */}
          <div className="pt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full sm:w-auto px-6 py-2.5 gap-2 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-all animate-fade-up"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </Button>
          </div>

          {/* ── Logout confirmation overlay ── */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-fade-in">
              <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
                <div className="w-12 h-12 rounded-2xl bg-destructive/15 border border-destructive/25 flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-base font-semibold text-foreground text-center mb-2">
                  Are you sure you want to logout?
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  You will need to sign in again to access your dashboard.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Yes, logout
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
