"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ScoreRingProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function ScoreRing({ score, size = "md", showLabel = true, className }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const [mounted, setMounted] = useState(false)

  const sizeConfig = {
    sm: { width: 48, strokeWidth: 4, fontSize: "text-xs" },
    md: { width: 80, strokeWidth: 6, fontSize: "text-lg" },
    lg: { width: 120, strokeWidth: 8, fontSize: "text-2xl" }
  }

  const { width, strokeWidth, fontSize } = sizeConfig[size]
  const radius = (width - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (displayScore / 100) * circumference
  const offset = circumference - progress

  const getScoreColor = (s: number) => {
    if (s >= 80) return "#10B981"
    if (s >= 60) return "#F59E0B"
    return "#EF4444"
  }

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(handle)
  }, [])

  useEffect(() => {
    let animationFrameId: number
    const startTime = performance.now()
    const duration = 1000 // 1.0 second animation

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progressRatio = Math.min(elapsed / duration, 1)
      
      // Easing function: easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progressRatio, 3)
      
      setDisplayScore(easeProgress * score)

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate)
    }, 100)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animationFrameId)
    }
  }, [score])

  if (!mounted) {
    return (
      <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width, height: width }}>
        <div className="skeleton-shimmer rounded-full" style={{ width, height: width }} />
      </div>
    )
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width, height: width }}>
      <svg width={width} height={width} className="score-ring">
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="#1F2937"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showLabel && (
        <span className={cn("absolute font-bold text-foreground", fontSize)}>
          {Math.round(displayScore)}
        </span>
      )}
    </div>
  )
}

