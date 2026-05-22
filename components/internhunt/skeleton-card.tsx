import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-2xl p-5', className)}>
      <div className="flex items-start gap-3.5">
        {/* Avatar */}
        <div className="w-11 h-11 skeleton-shimmer rounded-xl flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 skeleton-shimmer rounded-md" />
              <div className="h-3.5 w-1/2 skeleton-shimmer rounded-md" />
            </div>
            <div className="w-12 h-12 skeleton-shimmer rounded-full flex-shrink-0" />
          </div>

          <div className="flex gap-4 mt-3">
            <div className="h-3 w-20 skeleton-shimmer rounded-md" />
            <div className="h-3 w-24 skeleton-shimmer rounded-md" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <div className="h-6 w-20 skeleton-shimmer rounded-full" />
        <div className="h-3 w-28 skeleton-shimmer rounded-md ml-auto" />
      </div>

      <div className="mt-4 pt-4 border-t border-border flex gap-2">
        <div className="h-9 flex-1 skeleton-shimmer rounded-xl" />
        <div className="h-9 w-9 skeleton-shimmer rounded-xl flex-shrink-0" />
      </div>
    </div>
  )
}

export function SkeletonAgentCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-2xl p-5', className)}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 skeleton-shimmer rounded-lg flex-shrink-0" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-20 skeleton-shimmer rounded-md" />
          <div className="h-3 w-12 skeleton-shimmer rounded-md" />
        </div>
        <div className="h-7 w-16 skeleton-shimmer rounded-lg ml-auto" />
      </div>

      <div className="space-y-2">
        <div className="h-10 skeleton-shimmer rounded-lg" />
        <div className="h-10 skeleton-shimmer rounded-lg" />
      </div>
    </div>
  )
}
