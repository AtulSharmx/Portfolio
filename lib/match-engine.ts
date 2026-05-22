import { UserProfile } from '@/hooks/use-user'

export interface GeneratedMatch {
  id: string
  company: string
  role: string
  stipend: string
  location: string
  matchScore: number
  deadline: string
  duration: string
  description: string
  requirements: string[]
  matchedSkills: string[]
  missingSkills: string[]
  coverLetter: string
}

interface RawOpportunity {
  company: string
  role: string
  baseStipend: number
  duration: string
  description: string
  requirements: string[]
}

const OPPORTUNITIES_BY_DOMAIN: Record<string, RawOpportunity[]> = {
  'Web Dev': [
    {
      company: 'Razorpay',
      role: 'Frontend Developer Intern',
      baseStipend: 25000,
      duration: '6 months',
      description: 'Join our checkout team to build fast, beautiful, and secure payment interfaces used by millions of merchants. You will work closely with developers and designers to build high-performance React applications.',
      requirements: ['React', 'TypeScript', 'JavaScript', 'Git', 'REST APIs', 'CSS'],
    },
    {
      company: 'PhonePe',
      role: 'Full Stack Intern',
      baseStipend: 30000,
      duration: '6 months',
      description: 'Work across our web app portfolio to engineer reliable end-to-end features. You will build user interfaces in React and connect them with backend services written in Node.js and Java.',
      requirements: ['React', 'Node.js', 'JavaScript', 'SQL', 'Git', 'Java'],
    },
    {
      company: 'Paytm',
      role: 'React Developer Intern',
      baseStipend: 22000,
      duration: '3 months',
      description: 'Help us build and maintain high-fidelity user dashboards using Next.js and Tailwind CSS. You will participate in code reviews, unit testing, and component design.',
      requirements: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'Git', 'CSS'],
    },
  ],
  'Data Science': [
    {
      company: 'Groww',
      role: 'Data Science Intern',
      baseStipend: 22000,
      duration: '6 months',
      description: 'Analyse real-world financial transaction data to discover trends, clean datasets, build predictive dashboards, and design key analytics models.',
      requirements: ['Python', 'SQL', 'Excel', 'Pandas', 'NumPy', 'Git'],
    },
    {
      company: 'Swiggy',
      role: 'Analytics Engineer Intern',
      baseStipend: 28000,
      duration: '3 months',
      description: 'Translate operational data into actionable dashboards. You will write high-performance SQL queries and support business intelligence teams on food and grocery delivery metrics.',
      requirements: ['SQL', 'Python', 'Excel', 'Data Visualization', 'Git'],
    },
  ],
  'Marketing': [
    {
      company: 'Swiggy',
      role: 'Growth Marketing Intern',
      baseStipend: 18000,
      duration: '3 months',
      description: 'Help manage digital marketing campaigns, run search engine optimization (SEO) experiments, and draft copy for social media channels.',
      requirements: ['Excel', 'Copywriting', 'SEO', 'Marketing Strategy', 'Social Media'],
    },
    {
      company: 'Zomato',
      role: 'Digital Campaign Intern',
      baseStipend: 20000,
      duration: '4 months',
      description: 'Join the marketing crew to assist in planning major viral campaigns, tracking click-through rates, and organizing event outreach.',
      requirements: ['Marketing Strategy', 'Excel', 'Communication', 'Social Media'],
    },
  ],
  'Design': [
    {
      company: 'Razorpay',
      role: 'Product Design Intern',
      baseStipend: 25000,
      duration: '6 months',
      description: 'Collaborate with product managers and developers to sketch wireframes, prototype flows, and craft production-ready UI mockups for our web payment products.',
      requirements: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Design Systems'],
    },
    {
      company: 'CRED',
      role: 'Visual Design Intern',
      baseStipend: 35000,
      duration: '6 months',
      description: 'Work on creating stunning visual assets, micro-interactions, and visual layouts that match CRED\'s high aesthetic benchmarks.',
      requirements: ['Figma', 'Photoshop', 'Illustrator', 'Visual Design', 'UI/UX Design'],
    },
  ],
  'Finance': [
    {
      company: 'Groww',
      role: 'Investment Analyst Intern',
      baseStipend: 25000,
      duration: '6 months',
      description: 'Support our research team in preparing stock market reports, verifying mutual fund documentation, and performing basic data analysis on market indicators.',
      requirements: ['Excel', 'Finance Principles', 'SQL', 'Data Analysis'],
    },
    {
      company: 'Zerodha',
      role: 'Operations Analyst Intern',
      baseStipend: 20000,
      duration: '3 months',
      description: 'Understand brokerage systems, audit financial ledger records, resolve client billing discrepancies, and analyze product volume logs.',
      requirements: ['Finance Principles', 'Excel', 'SQL', 'Communication'],
    },
  ],
  'HR': [
    {
      company: 'Flipkart',
      role: 'Talent Acquisition Intern',
      baseStipend: 15000,
      duration: '3 months',
      description: 'Source top engineering and business talent, screen initial candidate profiles, schedule interviews, and draft feedback summary sheets.',
      requirements: ['Communication', 'Excel', 'HR Systems', 'Organisational Skills'],
    },
  ],
  'Content': [
    {
      company: 'CRED',
      role: 'Creative Copywriter Intern',
      baseStipend: 28000,
      duration: '6 months',
      description: 'Draft witty, premium copy for app notifications, marketing banners, and landing pages that matches the high standard of the CRED brand.',
      requirements: ['Copywriting', 'Storytelling', 'Communication', 'Content Strategy'],
    },
  ],
  'Android': [
    {
      company: 'PhonePe',
      role: 'Android Developer Intern',
      baseStipend: 35000,
      duration: '6 months',
      description: 'Design features directly for our core Android app, which handles millions of daily transactions. You will write code in Kotlin and Java.',
      requirements: ['Kotlin', 'Java', 'Android SDK', 'Git', 'REST APIs'],
    },
    {
      company: 'Meesho',
      role: 'Flutter Developer Intern',
      baseStipend: 24000,
      duration: '3 months',
      description: 'Maintain and scale mobile components in Flutter. Assist in integrating REST APIs and fixing UI performance constraints across devices.',
      requirements: ['Flutter', 'JavaScript', 'Git', 'REST APIs'],
    },
  ],
  'ML/AI': [
    {
      company: 'Zerodha',
      role: 'AI Research Intern',
      baseStipend: 30000,
      duration: '6 months',
      description: 'Help build predictive models for transaction fraud detection and automated user support routing systems. You will write PyTorch and Python code.',
      requirements: ['Python', 'SQL', 'TensorFlow', 'PyTorch', 'ML/AI', 'Git'],
    },
    {
      company: 'InMobi',
      role: 'Machine Learning Intern',
      baseStipend: 28000,
      duration: '6 months',
      description: 'Optimize user click predictions on ad placements. You will perform feature engineering, dataset preparation, and train classification models.',
      requirements: ['Python', 'SQL', 'Scikit-learn', 'Git', 'TensorFlow'],
    },
  ],
  'DevOps': [
    {
      company: 'Razorpay',
      role: 'DevOps Intern',
      baseStipend: 26000,
      duration: '6 months',
      description: 'Learn and implement Kubernetes and Docker setups to monitor server status and optimize deployment pipelines for high-availability systems.',
      requirements: ['Docker', 'AWS', 'Git', 'Linux', 'SQL'],
    },
  ],
}

// Fallback pool in case user didn't specify domains
const DEFAULT_OPPORTUNITIES: RawOpportunity[] = [
  {
    company: 'Razorpay',
    role: 'Frontend Developer Intern',
    baseStipend: 25000,
    duration: '6 months',
    description: 'Join our frontend team to build scalable payment interfaces used by millions of businesses. You will work with React, JavaScript, and TypeScript.',
    requirements: ['React', 'JavaScript', 'TypeScript', 'Git', 'REST APIs'],
  },
  {
    company: 'Swiggy',
    role: 'Software Engineering Intern',
    baseStipend: 30000,
    duration: '3 months',
    description: 'Work on building features for our food delivery platform that serves millions of customers daily across India.',
    requirements: ['Python', 'JavaScript', 'SQL', 'Git', 'Problem Solving'],
  },
  {
    company: 'Zerodha',
    role: 'Full Stack Developer Intern',
    baseStipend: 20000,
    duration: '6 months',
    description: 'Build premium dashboard widgets and analytics panels. Work with React, SQL, and Python.',
    requirements: ['React', 'SQL', 'Python', 'JavaScript', 'Git'],
  },
  {
    company: 'CRED',
    role: 'React Developer Intern',
    baseStipend: 35000,
    duration: '6 months',
    description: 'Participate in building high-fidelity components and complex UI transitions using React, TypeScript, and modern styling libraries.',
    requirements: ['React', 'TypeScript', 'JavaScript', 'Figma', 'Git'],
  },
  {
    company: 'Groww',
    role: 'Backend Developer Intern',
    baseStipend: 22000,
    duration: '6 months',
    description: 'Help build fast and scalable database queries and financial ledger components. You will work in Python and SQL.',
    requirements: ['Python', 'SQL', 'Docker', 'Git'],
  },
]

export function generateMatchesForUser(user: UserProfile | null): GeneratedMatch[] {
  let pool: RawOpportunity[] = []

  if (user && user.domains && user.domains.length > 0) {
    user.domains.forEach(domain => {
      const matchOpts = OPPORTUNITIES_BY_DOMAIN[domain]
      if (matchOpts) {
        pool.push(...matchOpts)
      }
    })
  }

  // Deduplicate and pad if pool is small
  const seen = new Set<string>()
  pool = pool.filter(opt => {
    const key = `${opt.company}-${opt.role}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  if (pool.length === 0) {
    pool = [...DEFAULT_OPPORTUNITIES]
  } else if (pool.length < 5) {
    // Fill up to 5 with defaults
    DEFAULT_OPPORTUNITIES.forEach(defOpt => {
      const key = `${defOpt.company}-${defOpt.role}`
      if (!seen.has(key) && pool.length < 5) {
        pool.push(defOpt)
        seen.add(key)
      }
    })
  }

  const studentName = user?.name || 'John Wick'
  const studentCourse = user?.course || 'B.Tech Computer Science'
  const studentSkills = user?.skills || ['React', 'JavaScript', 'SQL', 'Git']
  const studentLocation = user?.location || 'Remote'

  // Map to generated matches with real match score calculations
  const matches = pool.map((opt, index) => {
    // Calculate match score
    const matched: string[] = []
    const missing: string[] = []

    opt.requirements.forEach(req => {
      // Simple case-insensitive matching
      const hasSkill = studentSkills.some(
        s => s.toLowerCase() === req.toLowerCase() ||
             (req.toLowerCase() === 'rest apis' && s.toLowerCase() === 'javascript') ||
             (req.toLowerCase() === 'data analysis' && s.toLowerCase() === 'excel')
      )

      if (hasSkill) {
        matched.push(req)
      } else {
        missing.push(req)
      }
    })

    // Calculate score. Minimum score 50% to make it feel encouraging, maximum 98%
    const ratio = opt.requirements.length > 0 ? matched.length / opt.requirements.length : 0.8
    const matchScore = Math.min(98, Math.max(45, Math.round(ratio * 40 + 58)))

    // Generate locations deterministically
    const locations = ['Remote', 'On-site', 'Hybrid', 'Flexible']
    const location = studentLocation === 'Remote' 
      ? (index % 2 === 0 ? 'Remote' : locations[index % locations.length])
      : (index % 3 === 0 ? 'Remote' : studentLocation)

    // Format stipend
    const stipend = `₹${(opt.baseStipend).toLocaleString('en-IN')}/month`

    // Generate deadliness
    const deadlineDays = [10, 15, 20, 25, 30]
    const deadlineDate = new Date()
    deadlineDate.setDate(deadlineDate.getDate() + deadlineDays[index % deadlineDays.length])
    const deadline = deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    // Build the dynamic cover letter
    const matchedListStr = matched.length > 0 
      ? `my proficiency in ${matched.join(', ')}` 
      : 'my background in technology and fast learning pace'
    
    const missingListStr = missing.length > 0
      ? `I am excited to pick up ${missing.join(', ')} rapidly to fit into your technical stack.`
      : 'I look forward to jumping into your codebase directly on day one.'

    const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${opt.role} position at ${opt.company}. As a ${studentCourse} student at my college, I have been actively building skills that align closely with the work done by your engineering and product teams.

Having looked closely at the requirements for this role, I believe ${matchedListStr} would allow me to hit the ground running. I have applied these skills to several academic projects, building fully functional user flows and clean architectures.

I am particularly excited about ${opt.company} because of your focus on building high-impact products for the Indian market. The opportunity to work on products used by millions of customers daily is both challenging and incredibly motivating.

${missingListStr} I am eager to learn from your experienced developers and make a meaningful contribution to your product goals.

Thank you for considering my application. I look forward to discussing how I can add value to the ${opt.company} team.

Best regards,
${studentName}`

    return {
      id: (index + 1).toString(),
      company: opt.company,
      role: opt.role,
      stipend,
      location,
      matchScore,
      deadline,
      duration: opt.duration,
      description: opt.description,
      requirements: opt.requirements,
      matchedSkills: matched,
      missingSkills: missing,
      coverLetter,
    }
  })

  // Sort matches by score descending
  return matches.sort((a, b) => b.matchScore - a.matchScore)
}

export function getSingleMatchDetails(id: string, user: UserProfile | null): GeneratedMatch {
  const matches = generateMatchesForUser(user)
  const match = matches.find(m => m.id === id)
  if (match) return match
  
  // Return a generic fallback
  return {
    id,
    company: 'Razorpay',
    role: 'Frontend Developer Intern',
    stipend: '₹25,000/month',
    location: 'On-site',
    matchScore: 92,
    deadline: 'Dec 15, 2026',
    duration: '6 months',
    description: 'Build high-performance checkouts.',
    requirements: ['React', 'TypeScript', 'JavaScript'],
    matchedSkills: ['React', 'JavaScript'],
    missingSkills: ['TypeScript'],
    coverLetter: 'Dear Hiring Manager,\n\nI am writing to express interest.\n\nBest regards,\nJohn Wick',
  }
}
