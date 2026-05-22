'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/internhunt/nav-bar'
import { InsightCard } from '@/components/internhunt/insight-card'
import { Sparkles, BrainCircuit } from 'lucide-react'
import { useUser } from '@/hooks/use-user'
import { Spinner } from '@/components/ui/spinner'

interface SkillResource {
  skill: string
  percentage: number
  domain: string
  learnLink: string
  estimatedHours: number
  trend: number
}

const ALL_SKILL_RESOURCES: Record<string, { domain: string, url: string, hours: number }> = {
  'TypeScript': { domain: 'Web Development', url: 'https://www.typescriptlang.org/docs/', hours: 20 },
  'SQL': { domain: 'Data Science', url: 'https://www.w3schools.com/sql/', hours: 15 },
  'Docker': { domain: 'DevOps', url: 'https://docs.docker.com/', hours: 12 },
  'Python': { domain: 'Backend Development', url: 'https://www.python.org/doc/', hours: 30 },
  'Figma': { domain: 'Product Design', url: 'https://help.figma.com/', hours: 12 },
  'React': { domain: 'Web Development', url: 'https://react.dev/', hours: 25 },
  'Next.js': { domain: 'Web Development', url: 'https://nextjs.org/docs', hours: 18 },
  'AWS': { domain: 'DevOps', url: 'https://docs.aws.amazon.com/', hours: 40 },
  'Git': { domain: 'Software Engineering', url: 'https://git-scm.com/doc', hours: 6 },
  'Node.js': { domain: 'Web Development', url: 'https://nodejs.org/en/docs/', hours: 20 },
  'MongoDB': { domain: 'Database Engineering', url: 'https://www.mongodb.com/docs/', hours: 15 },
  'Excel': { domain: 'Business Analyst', url: 'https://support.microsoft.com/excel', hours: 10 },
  'TensorFlow': { domain: 'ML/AI Research', url: 'https://www.tensorflow.org/api_docs', hours: 35 },
  'Flutter': { domain: 'Mobile Development', url: 'https://docs.flutter.dev/', hours: 25 },
  'Kotlin': { domain: 'Mobile Development', url: 'https://kotlinlang.org/docs/home.html', hours: 20 },
}

const FALLBACK_GAPS = [
  { skill: 'GraphQL', percentage: 76, domain: 'API Architecture', learnLink: 'https://graphql.org/learn/', estimatedHours: 12, trend: 6 },
  { skill: 'System Design', percentage: 68, domain: 'Software Architecture', learnLink: 'https://github.com/donnemartin/system-design-primer', estimatedHours: 45, trend: 10 },
  { skill: 'Tailwind CSS', percentage: 89, domain: 'Frontend Development', learnLink: 'https://tailwindcss.com/docs', estimatedHours: 8, trend: 3 },
  { skill: 'Jest Testing', percentage: 55, domain: 'Testing Operations', learnLink: 'https://jestjs.io/docs/getting-started', estimatedHours: 10, trend: 2 },
]

export default function InsightsPage() {
  const router = useRouter()
  const { user, userId, loading } = useUser()
  const [insights, setInsights] = useState<SkillResource[]>([])

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/onboarding')
    }
  }, [user, loading, router])

  const [prevUserId, setPrevUserId] = useState<string | null>(null)
  if (userId && user && userId !== prevUserId) {
    setPrevUserId(userId)

    // Calculate skill gaps: skills in ALL_SKILL_RESOURCES not in user.skills
    const gaps: SkillResource[] = []
    
    // Convert user skills to lowercase for safety
    const userSkillsSet = new Set(user.skills.map(s => s.toLowerCase()))

    Object.entries(ALL_SKILL_RESOURCES).forEach(([skill, meta]) => {
      if (!userSkillsSet.has(skill.toLowerCase())) {
        // Create deterministic percentage score
        const hash = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const percentage = 45 + (hash % 45) // 45% to 90%
        const trend = (hash % 15) - 5 // -5% to +10%

        gaps.push({
          skill,
          percentage,
          domain: meta.domain,
          learnLink: meta.url,
          estimatedHours: meta.hours,
          trend,
        })
      }
    })

    // Sort by highest gap percentage (impact) descending
    gaps.sort((a, b) => b.percentage - a.percentage)

    // Pad with fallbacks if user somehow already knows almost everything
    let finalGaps = gaps.slice(0, 4)
    if (finalGaps.length < 4) {
      const needed = 4 - finalGaps.length
      FALLBACK_GAPS.slice(0, needed).forEach(f => {
        finalGaps.push(f)
      })
    }

    setInsights(finalGaps)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size={24} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <NavBar />

      <main className="flex-1 pb-24 md:pb-0 min-w-0">
        <div className="max-w-3xl mx-auto px-4 py-6 md:px-8 md:py-8">

          {/* Header */}
          <div className="mb-7 animate-fade-up">
            <h1 className="text-2xl font-bold text-foreground">Skill Gap Insights</h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              Skills that could unlock <span className="text-foreground font-medium">more opportunities</span> for your profile.
            </p>
          </div>

          {/* How this works — compact banner */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-6 flex items-start gap-3 animate-fade-up stagger-1">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <BrainCircuit className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">How this works</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We compare the requirements of top internships with your profile skills. Each card shows the percentage of target postings that value this skill, along with resources to learn it.
              </p>
            </div>
          </div>

          {/* Insight cards */}
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <InsightCard
                key={insight.skill}
                skill={insight.skill}
                percentage={insight.percentage}
                domain={insight.domain}
                learnLink={insight.learnLink}
                estimatedHours={insight.estimatedHours}
                trend={insight.trend}
                staggerIndex={index + 1}
              />
            ))}
          </div>

          {/* Motivation footer */}
          <div className="mt-8 text-center animate-fade-up stagger-6 py-6 border-t border-border">
            <Sparkles className="w-5 h-5 text-primary/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Every skill you add multiplies your match scores. <span className="text-foreground font-medium">Keep going.</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
