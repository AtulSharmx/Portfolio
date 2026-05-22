import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/hooks/use-user'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'InternHunt — AI Agent That Hunts Internships While You Sleep',
  description:
    'Your AI agent automatically finds internships every day, scores them against your profile, and generates personalized cover letters. Built for Indian college students.',
  keywords: [
    'internship',
    'AI internship finder',
    'Indian college students',
    'internship matching',
    'cover letter generator',
    'Internshala alternative',
  ],
  authors: [{ name: 'InternHunt' }],
  creator: 'InternHunt',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://internhunt.in',
    title: 'InternHunt — AI Agent That Hunts Internships While You Sleep',
    description:
      'Set up once. Wake up to personalized matches, AI-crafted cover letters, and a clear path to your dream role.',
    siteName: 'InternHunt',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InternHunt — AI Internship Hunting for Indian Students',
    description:
      'Your AI agent finds internships every day, scores them, and writes cover letters. Free forever.',
    creator: '@internhunt_in',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#030303',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  )
}
