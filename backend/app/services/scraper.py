import logging
import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Static opportunity pool to simulate scraped results
OPPORTUNITIES_POOL = {
    'Web Dev': [
        {
            'company': 'Razorpay',
            'role': 'Frontend Developer Intern',
            'baseStipend': 25000,
            'duration': '6 months',
            'description': 'Join our checkout team to build fast, beautiful, and secure payment interfaces used by millions of merchants. You will work closely with developers and designers to build high-performance React applications.',
            'requirements': ['React', 'TypeScript', 'JavaScript', 'Git', 'REST APIs', 'CSS'],
        },
        {
            'company': 'PhonePe',
            'role': 'Full Stack Intern',
            'baseStipend': 30000,
            'duration': '6 months',
            'description': 'Work across our web app portfolio to engineer reliable end-to-end features. You will build user interfaces in React and connect them with backend services written in Node.js and Java.',
            'requirements': ['React', 'Node.js', 'JavaScript', 'SQL', 'Git', 'Java'],
        },
        {
            'company': 'Paytm',
            'role': 'React Developer Intern',
            'baseStipend': 22000,
            'duration': '3 months',
            'description': 'Help us build and maintain high-fidelity user dashboards using Next.js and Tailwind CSS. You will participate in code reviews, unit testing, and component design.',
            'requirements': ['React', 'Next.js', 'JavaScript', 'TypeScript', 'Git', 'CSS'],
        },
    ],
    'Data Science': [
        {
            'company': 'Groww',
            'role': 'Data Science Intern',
            'baseStipend': 22000,
            'duration': '6 months',
            'description': 'Analyse real-world financial transaction data to discover trends, clean datasets, build predictive dashboards, and design key analytics models.',
            'requirements': ['Python', 'SQL', 'Excel', 'Pandas', 'NumPy', 'Git'],
        },
        {
            'company': 'Swiggy',
            'role': 'Analytics Engineer Intern',
            'baseStipend': 28000,
            'duration': '3 months',
            'description': 'Translate operational data into actionable dashboards. You will write high-performance SQL queries and support business intelligence teams on food and grocery delivery metrics.',
            'requirements': ['SQL', 'Python', 'Excel', 'Data Visualization', 'Git'],
        },
    ],
    'Marketing': [
        {
            'company': 'Swiggy',
            'role': 'Growth Marketing Intern',
            'baseStipend': 18000,
            'duration': '3 months',
            'description': 'Help manage digital marketing campaigns, run search engine optimization (SEO) experiments, and draft copy for social media channels.',
            'requirements': ['Excel', 'Copywriting', 'SEO', 'Marketing Strategy', 'Social Media'],
        },
        {
            'company': 'Zomato',
            'role': 'Digital Campaign Intern',
            'baseStipend': 20000,
            'duration': '4 months',
            'description': 'Join the marketing crew to assist in planning major viral campaigns, tracking click-through rates, and organizing event outreach.',
            'requirements': ['Marketing Strategy', 'Excel', 'Communication', 'Social Media'],
        },
    ],
    'Design': [
        {
            'company': 'Razorpay',
            'role': 'Product Design Intern',
            'baseStipend': 25000,
            'duration': '6 months',
            'description': 'Collaborate with product managers and developers to sketch wireframes, prototype flows, and craft production-ready UI mockups for our web payment products.',
            'requirements': ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Design Systems'],
        },
        {
            'company': 'CRED',
            'role': 'Visual Design Intern',
            'baseStipend': 35000,
            'duration': '6 months',
            'description': 'Work on creating stunning visual assets, micro-interactions, and visual layouts that match CRED\'s high aesthetic benchmarks.',
            'requirements': ['Figma', 'Photoshop', 'Illustrator', 'Visual Design', 'UI/UX Design'],
        },
    ],
    'Finance': [
        {
            'company': 'Groww',
            'role': 'Investment Analyst Intern',
            'baseStipend': 25000,
            'duration': '6 months',
            'description': 'Support our research team in preparing stock market reports, verifying mutual fund documentation, and performing basic data analysis on market indicators.',
            'requirements': ['Excel', 'Finance Principles', 'SQL', 'Data Analysis'],
        },
        {
            'company': 'Zerodha',
            'role': 'Operations Analyst Intern',
            'baseStipend': 20000,
            'duration': '3 months',
            'description': 'Understand brokerage systems, audit financial ledger records, resolve client billing discrepancies, and analyze product volume logs.',
            'requirements': ['Finance Principles', 'Excel', 'SQL', 'Communication'],
        },
    ],
    'HR': [
        {
            'company': 'Flipkart',
            'role': 'Talent Acquisition Intern',
            'baseStipend': 15000,
            'duration': '3 months',
            'description': 'Source top engineering and business talent, screen initial candidate profiles, schedule interviews, and draft feedback summary sheets.',
            'requirements': ['Communication', 'Excel', 'HR Systems', 'Organisational Skills'],
        },
    ],
    'Content': [
        {
            'company': 'CRED',
            'role': 'Creative Copywriter Intern',
            'baseStipend': 28000,
            'duration': '6 months',
            'description': 'Draft witty, premium copy for app notifications, marketing banners, and landing pages that matches the high standard of the CRED brand.',
            'requirements': ['Copywriting', 'Storytelling', 'Communication', 'Content Strategy'],
        },
    ],
    'Android': [
        {
            'company': 'PhonePe',
            'role': 'Android Developer Intern',
            'baseStipend': 35000,
            'duration': '6 months',
            'description': 'Design features directly for our core Android app, which handles millions of daily transactions. You will write code in Kotlin and Java.',
            'requirements': ['Kotlin', 'Java', 'Android SDK', 'Git', 'REST APIs'],
        },
        {
            'company': 'Meesho',
            'role': 'Flutter Developer Intern',
            'baseStipend': 24000,
            'duration': '3 months',
            'description': 'Maintain and scale mobile components in Flutter. Assist in integrating REST APIs and fixing UI performance constraints across devices.',
            'requirements': ['Flutter', 'JavaScript', 'Git', 'REST APIs'],
        },
    ],
    'ML/AI': [
        {
            'company': 'Zerodha',
            'role': 'AI Research Intern',
            'baseStipend': 30000,
            'duration': '6 months',
            'description': 'Help build predictive models for transaction fraud detection and automated user support routing systems. You will write PyTorch and Python code.',
            'requirements': ['Python', 'SQL', 'TensorFlow', 'PyTorch', 'ML/AI', 'Git'],
        },
        {
            'company': 'InMobi',
            'role': 'Machine Learning Intern',
            'baseStipend': 28000,
            'duration': '6 months',
            'description': 'Optimize user click predictions on ad placements. You will perform feature engineering, dataset preparation, and train classification models.',
            'requirements': ['Python', 'SQL', 'Scikit-learn', 'Git', 'TensorFlow'],
        },
    ],
    'DevOps': [
        {
            'company': 'Razorpay',
            'role': 'DevOps Intern',
            'baseStipend': 26000,
            'duration': '6 months',
            'description': 'Learn and implement Kubernetes and Docker setups to monitor server status and optimize deployment pipelines for high-availability systems.',
            'requirements': ['Docker', 'AWS', 'Git', 'Linux', 'SQL'],
        },
    ],
}

DEFAULT_POOL = [
    {
        'company': 'Razorpay',
        'role': 'Frontend Developer Intern',
        'baseStipend': 25000,
        'duration': '6 months',
        'description': 'Join our frontend team to build scalable payment interfaces used by millions of businesses. You will work with React, JavaScript, and TypeScript.',
        'requirements': ['React', 'JavaScript', 'TypeScript', 'Git', 'REST APIs'],
    },
    {
        'company': 'Swiggy',
        'role': 'Software Engineering Intern',
        'baseStipend': 30000,
        'duration': '3 months',
        'description': 'Work on building features for our food delivery platform that serves millions of customers daily across India.',
        'requirements': ['Python', 'JavaScript', 'SQL', 'Git', 'Problem Solving'],
    },
    {
        'company': 'Zerodha',
        'role': 'Full Stack Developer Intern',
        'baseStipend': 20000,
        'duration': '6 months',
        'description': 'Build premium dashboard widgets and analytics panels. Work with React, SQL, and Python.',
        'requirements': ['React', 'SQL', 'Python', 'JavaScript', 'Git'],
    },
    {
        'company': 'CRED',
        'role': 'React Developer Intern',
        'baseStipend': 35000,
        'duration': '6 months',
        'description': 'Participate in building high-fidelity components and complex UI transitions using React, TypeScript, and modern styling libraries.',
        'requirements': ['React', 'TypeScript', 'JavaScript', 'Figma', 'Git'],
    },
    {
        'company': 'Groww',
        'role': 'Backend Developer Intern',
        'baseStipend': 22000,
        'duration': '6 months',
        'description': 'Help build fast and scalable database queries and financial ledger components. You will work in Python and SQL.',
        'requirements': ['Python', 'SQL', 'Docker', 'Git'],
    },
]

class JobScraper:
    """
    Mock/real scraper service for crawling internship boards.
    Uses beautifulsoup4 and httpx as placeholders for actual crawler code.
    """
    
    async def scrape_jobs(self, domains: List[str] = None) -> List[Dict[str, Any]]:
        """
        Mock job fetch. In a live system, this runs async requests to search
        job boards and parse raw HTML with BeautifulSoup.
        """
        logger.info(f"Mock scraping opportunities for domains: {domains}")
        
        # Simulate a small delay for scraping
        # await asyncio.sleep(0.5)

        pool = []
        if domains:
            for domain in domains:
                opts = OPPORTUNITIES_POOL.get(domain)
                if opts:
                    pool.extend(opts)
        
        # Deduplicate
        seen = set()
        unique_pool = []
        for opt in pool:
            key = f"{opt['company']}-{opt['role']}"
            if key not in seen:
                seen.add(key)
                unique_pool.append(opt)
                
        if not unique_pool:
            unique_pool = list(DEFAULT_POOL)
        elif len(unique_pool) < 5:
            # Pad
            for default_opt in DEFAULT_POOL:
                key = f"{default_opt['company']}-{default_opt['role']}"
                if key not in seen and len(unique_pool) < 5:
                    unique_pool.append(default_opt)
                    seen.add(key)
                    
        return unique_pool
