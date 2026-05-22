/**
 * useUser — lightweight user state hook connected to Supabase
 * Reads from profiles table & tracks auth session.
 * Exposes login status, logout, and profile update.
 */

'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase'

export interface UserProfile {
  name: string
  course: string
  email: string
  domains: string[]
  skills: string[]
  location: string
  runTime: string
  hasSeenTutorial?: boolean
  createdAt?: string
  isActive?: boolean
  emailNotifications?: boolean
  pushNotifications?: boolean
}

// Convert DB schema to UserProfile camelCase interface
function mapProfileFromDb(dbProfile: any, email: string, uid?: string): UserProfile {
  return {
    name: dbProfile.name || '',
    course: dbProfile.course || '',
    email: dbProfile.email || email || '',
    domains: dbProfile.domains || [],
    skills: dbProfile.skills || [],
    location: dbProfile.location || 'Remote',
    runTime: dbProfile.run_time || '09:00',
    hasSeenTutorial: dbProfile.has_seen_tutorial !== undefined
      ? (dbProfile.has_seen_tutorial ?? false)
      : (typeof window !== 'undefined' && uid
        ? localStorage.getItem(`internhunt_has_seen_tutorial_${uid}`) === 'true'
        : false),
    createdAt: dbProfile.created_at || new Date().toISOString(),
    isActive: dbProfile.is_active ?? true,
    emailNotifications: dbProfile.email_notifications ?? true,
    pushNotifications: dbProfile.push_notifications ?? false,
  }
}

// Convert UserProfile updates to DB schema snake_case fields
function mapProfileToDb(updates: Partial<UserProfile>) {
  const dbUpdates: any = {}
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.course !== undefined) dbUpdates.course = updates.course
  if (updates.email !== undefined) dbUpdates.email = updates.email
  if (updates.domains !== undefined) dbUpdates.domains = updates.domains
  if (updates.skills !== undefined) dbUpdates.skills = updates.skills
  if (updates.location !== undefined) dbUpdates.location = updates.location
  if (updates.runTime !== undefined) dbUpdates.run_time = updates.runTime
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
  if (updates.emailNotifications !== undefined) dbUpdates.email_notifications = updates.emailNotifications
  if (updates.pushNotifications !== undefined) dbUpdates.push_notifications = updates.pushNotifications
  dbUpdates.updated_at = new Date().toISOString()
  return dbUpdates
}

export async function migrateLocalStorageToSupabase(userId: string) {
  try {
    // 1. Migrate profile data
    const localUserRaw = localStorage.getItem('internhunt_user')
    if (localUserRaw) {
      const localUser = JSON.parse(localUserRaw)
      if (localUser && localUser.name) {
        // Update user profile in Supabase
        await supabase
          .from('profiles')
          .update({
            name: localUser.name,
            course: localUser.course,
            domains: localUser.domains,
            skills: localUser.skills,
            location: localUser.location,
            run_time: localUser.runTime || '09:00',
          })
          .eq('id', userId)
      }
    }

    // 2. Migrate applications tracker data
    const localAppsRaw = localStorage.getItem('internhunt_applications')
    if (localAppsRaw) {
      const localApps = JSON.parse(localAppsRaw) as any[]
      if (localApps && localApps.length > 0) {
        // Fetch existing database applications to avoid duplicates
        const { data: existingApps } = await supabase
          .from('applications')
          .select('company, role')
          .eq('user_id', userId)
        
        const existingKeys = new Set(
          existingApps?.map(a => `${a.company.toLowerCase()}-${a.role.toLowerCase()}`) || []
        )

        const appsToInsert = localApps
          .filter(app => app.company && app.role && !existingKeys.has(`${app.company.toLowerCase()}-${app.role.toLowerCase()}`))
          .map(app => ({
            user_id: userId,
            company: app.company,
            role: app.role,
            date_applied: app.dateApplied || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: app.status || 'applied'
          }))

        if (appsToInsert.length > 0) {
          const { error } = await supabase.from('applications').insert(appsToInsert)
          if (error) console.error('Error inserting migrated apps:', error)
        }
      }
    }

    // Clear local storage items so migration doesn't run again
    localStorage.removeItem('internhunt_user')
    localStorage.removeItem('internhunt_applications')
  } catch (e) {
    console.error('Failed to migrate localStorage to Supabase:', e)
  }
}

export interface UserContextType {
  user: UserProfile | null
  userId: string | null
  loading: boolean
  isLoggedIn: boolean
  logout: () => Promise<void>
  updateUser: (updates: Partial<UserProfile>) => Promise<void>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (uid: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single()

      if (error) {
        console.error('Error fetching profile from database:', error)
        setUser(null)
      } else if (data) {
        setUser(mapProfileFromDb(data, email, uid))
      }
    } catch (e) {
      console.error('Exception fetching user profile:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    // Fetch initial auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      if (session?.user) {
        setUserId(session.user.id)
        fetchProfile(session.user.id, session.user.email || '')
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    // Listen to changes in auth state (login/logout/signup)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        if (session?.user) {
          setUserId(session.user.id)
          await fetchProfile(session.user.id, session.user.email || '')
          // Automatically trigger local storage data migration on login/signup
          await migrateLocalStorageToSupabase(session.user.id)
          // Re-fetch profile in case data was updated during migration
          await fetchProfile(session.user.id, session.user.email || '')
        } else {
          setUserId(null)
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUserId(null)
    setUser(null)
    setLoading(false)
  }

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!userId) return
    // Optimistic UI updates
    setUser(prev => prev ? { ...prev, ...updates } : null)

    // Save local-only updates (like hasSeenTutorial) to localStorage
    if (updates.hasSeenTutorial !== undefined && typeof window !== 'undefined') {
      localStorage.setItem(`internhunt_has_seen_tutorial_${userId}`, String(updates.hasSeenTutorial))
    }

    try {
      const dbUpdates = mapProfileToDb(updates)
      
      // Only call Supabase update if there are fields to change besides updated_at
      const hasDbFields = Object.keys(dbUpdates).some(k => k !== 'updated_at')
      if (hasDbFields) {
        const { error } = await supabase
          .from('profiles')
          .update(dbUpdates)
          .eq('id', userId)

        if (error) {
          console.error('Failed to save profile updates to database:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          // Rollback optimistic updates by re-fetching
          if (user) fetchProfile(userId, user.email)
        }
      }
    } catch (e) {
      console.error('Exception while saving profile updates:', e)
    }
  }

  const isLoggedIn = !loading && user !== null

  return (
    <UserContext.Provider value={{ user, userId, loading, isLoggedIn, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

/** Convenience: get first name only */
export function useFirstName(): string {
  const { user } = useUser()
  if (!user) return ''
  if (!user.name) return 'Intern'
  return user.name.trim().split(' ')[0] || 'Intern'
}
