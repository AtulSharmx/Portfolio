"use client"

import { cn } from "@/lib/utils"

interface SkillBadgeProps {
  skill: string
  selected?: boolean
  onClick?: () => void
  variant?: "default" | "matched" | "missing"
  size?: "sm" | "md"
}

export function SkillBadge({ 
  skill, 
  selected = false, 
  onClick, 
  variant = "default",
  size = "md" 
}: SkillBadgeProps) {
  const baseStyles = "skill-badge inline-flex items-center justify-center font-medium rounded-full cursor-pointer select-none"
  
  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-4 py-2 text-sm"
  }

  const variantStyles = {
    default: selected 
      ? "bg-primary text-primary-foreground" 
      : "bg-card text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground",
    matched: "bg-success/20 text-success border border-success/30",
    missing: "bg-destructive/20 text-destructive border border-destructive/30"
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant]
      )}
    >
      {variant === "matched" && <span className="mr-1">&#10003;</span>}
      {variant === "missing" && <span className="mr-1">&#10005;</span>}
      {skill}
    </button>
  )
}
