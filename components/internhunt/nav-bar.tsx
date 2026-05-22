'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/use-user'
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Settings,
  Zap,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tracker',   label: 'Tracker',   icon: ClipboardList },
  { href: '/insights',  label: 'Insights',  icon: BarChart3 },
  { href: '/settings',  label: 'Settings',  icon: Settings },
]

export function NavBar() {
  const pathname = usePathname()
  const { user, loading } = useUser()

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <nav
        className={cn(
          'hidden md:flex flex-col w-60 flex-shrink-0',
          'border-r border-sidebar-border bg-sidebar',
          'sticky top-0 h-screen overflow-y-auto'
        )}
      >
        {/* Brand */}
        <div className="flex items-center px-5 py-5 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/20">
              <Zap className="w-4.5 h-4.5 text-white fill-white/10" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Intern<span className="text-violet-400">Hunt</span>
            </span>
          </Link>
        </div>

        {/* Nav items */}
        <div className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')
            const elementId = item.href === '/tracker' ? 'sidebar-tracker' : item.href === '/insights' ? 'sidebar-insights' : undefined

            return (
              <Link
                key={item.href}
                href={item.href}
                id={elementId}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  'transition-all duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                {/* Active indicator bar */}
                <span
                  className={cn(
                    'absolute left-0 w-0.5 h-5 rounded-r-full bg-primary transition-all duration-200',
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'
                  )}
                />
                <Icon
                  className={cn(
                    'w-4.5 h-4.5 flex-shrink-0 transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70'
                  )}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span>{item.label}</span>

                {/* Active dot */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Agent status pill */}
        <div className="px-3 pb-4">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-success/8 border border-success/15">
            <span className="relative flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-success block" />
              <span className="w-2 h-2 rounded-full bg-success block absolute inset-0 animate-ping-sm opacity-75" />
            </span>
            <span className="text-xs font-medium text-success">Agent active</span>
            <span className="ml-auto text-[10px] text-success/60 font-medium">LIVE</span>
          </div>
        </div>

        {/* User profile */}
        <div className="p-3 border-t border-sidebar-border">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-600/30 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">
                {user && user.name ? (user.name.trim().charAt(0).toUpperCase() || 'U') : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {loading ? 'Loading...' : (user && user.name ? user.name : 'Guest Intern')}
              </p>
              <p className="text-[11px] text-sidebar-foreground/40 truncate">
                {loading ? '' : (user && user.course ? user.course : 'Student')}
              </p>
            </div>
            <Settings className="w-3.5 h-3.5 text-sidebar-foreground/25 group-hover:text-sidebar-foreground/50 flex-shrink-0 transition-colors" />
          </Link>
        </div>
      </nav>

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className={cn(
          'md:hidden fixed bottom-0 left-0 right-0 z-50',
          'bg-sidebar/95 backdrop-blur-xl',
          'border-t border-sidebar-border',
          'px-2 pb-safe-area-inset-bottom'
        )}
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
      >
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')
            const elementId = item.href === '/tracker' ? 'sidebar-tracker-mobile' : item.href === '/insights' ? 'sidebar-insights-mobile' : undefined

            return (
              <Link
                key={item.href}
                href={item.href}
                id={elementId}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 px-4 rounded-xl min-w-0 flex-1',
                  'transition-all duration-150',
                  isActive
                    ? 'text-primary'
                    : 'text-sidebar-foreground/40 hover:text-sidebar-foreground/70'
                )}
              >
                <div className="relative">
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                  {isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </div>
                <span className="text-[10px] font-medium truncate">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
