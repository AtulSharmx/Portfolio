'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/internhunt/nav-bar'
import { TrackerColumn } from '@/components/internhunt/tracker-column'
import { Button } from '@/components/ui/button'
import { Plus, ClipboardList, TrendingUp, XCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/ui/spinner'

type ApplicationStatus = 'applied' | 'heard-back' | 'rejected'

interface Application {
  id: string
  company: string
  role: string
  dateApplied: string
  status: ApplicationStatus
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
  bg: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 animate-fade-up">
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', bg)}>
        <Icon className={cn('w-4.5 h-4.5', color)} />
      </div>
      <div>
        <p className={cn('text-2xl font-bold leading-none', color)}>{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function TrackerPage() {
  const router = useRouter()
  const { user, userId, loading } = useUser()
  const [applications, setApplications] = useState<Application[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCompany, setNewCompany] = useState('')
  const [newRole, setNewRole] = useState('')

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/onboarding')
    }
  }, [user, loading, router])

  // Sync with Supabase Database
  useEffect(() => {
    if (!userId || !user) return

    const fetchApps = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          const mappedApps: Application[] = data.map((a: any) => ({
            id: a.id,
            company: a.company,
            role: a.role,
            dateApplied: a.date_applied,
            status: a.status as ApplicationStatus,
          }))
          setApplications(mappedApps)
        } else {
          setApplications([])
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err)
        setApplications([])
      }
    }

    fetchApps()
  }, [userId, user])

  const handleMove = async (id: string, newStatus: string) => {
    const updated = applications.map(app =>
      app.id === id ? { ...app, status: newStatus as ApplicationStatus } : app
    )
    setApplications(updated)

    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    } catch (err) {
      console.error('Failed to update application status:', err)
      // Rollback or re-fetch
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (data) {
        setApplications(data.map((a: any) => ({
          id: a.id,
          company: a.company,
          role: a.role,
          dateApplied: a.date_applied,
          status: a.status as ApplicationStatus,
        })))
      }
    }
  }

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompany.trim() || !newRole.trim() || !userId) return

    const dateAppliedStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({
          user_id: userId,
          company: newCompany.trim(),
          role: newRole.trim(),
          date_applied: dateAppliedStr,
          status: 'applied',
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newApp: Application = {
          id: data.id,
          company: data.company,
          role: data.role,
          dateApplied: data.date_applied,
          status: data.status as ApplicationStatus,
        }
        setApplications(prev => [newApp, ...prev])
      }
    } catch (err) {
      console.error('Failed to add application:', err)
    }
    
    setNewCompany('')
    setNewRole('')
    setShowAddModal(false)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size={24} />
      </div>
    )
  }

  const applied     = applications.filter(a => a.status === 'applied')
  const heardBack   = applications.filter(a => a.status === 'heard-back')
  const rejected    = applications.filter(a => a.status === 'rejected')
  const responseRate = applications.length
    ? Math.round((heardBack.length / applications.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <NavBar />

      <main className="flex-1 pb-24 md:pb-0 min-w-0">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-7 animate-fade-up">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Application Tracker</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {applications.length} total · {responseRate}% response rate
              </p>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              size="sm" 
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl btn-hover"
            >
              <Plus className="w-4 h-4" />
              <span>Add application</span>
            </Button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 mb-7">
            <StatPillsWrapper index={1}>
              <StatCard label="Applied"    value={applied.length}   icon={ClipboardList} color="text-violet-400" bg="bg-violet-500/10 border border-violet-500/20" />
            </StatPillsWrapper>
            <StatPillsWrapper index={2}>
              <StatCard label="Heard Back" value={heardBack.length} icon={TrendingUp}    color="text-emerald-400" bg="bg-emerald-500/10 border border-emerald-500/20" />
            </StatPillsWrapper>
            <StatPillsWrapper index={3}>
              <StatCard label="Rejected"   value={rejected.length}  icon={XCircle}       color="text-red-400" bg="bg-red-500/10 border border-red-500/20" />
            </StatPillsWrapper>
          </div>

          {/* Kanban board */}
          <div className="grid md:grid-cols-3 gap-5">
            <TrackerColumn title="Applied"    applications={applied}   status="applied"    onMoveApplication={handleMove} />
            <TrackerColumn title="Heard Back" applications={heardBack} status="heard-back" onMoveApplication={handleMove} />
            <TrackerColumn title="Rejected"   applications={rejected}  status="rejected"   onMoveApplication={handleMove} />
          </div>

          {/* Empty state */}
          {applications.length === 0 && (
            <div className="bg-card border border-border rounded-2xl p-10 text-center mt-6">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">No applications yet</h3>
              <p className="text-sm text-muted-foreground">Start applying to internships and track them here.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Add custom application
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Keep your dashboard stats accurate by logging your applications.
            </p>
            <form onSubmit={handleAddApplication} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Company name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PhonePe"
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  className="w-full h-10 px-3 bg-input border border-border text-foreground text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium">Role title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer Intern"
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="w-full h-10 px-3 bg-input border border-border text-foreground text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl h-10 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-10 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatPillsWrapper({ children, index }: { children: React.ReactNode, index: number }) {
  return (
    <div className={cn('animate-fade-up', `stagger-${index}`)}>
      {children}
    </div>
  )
}
