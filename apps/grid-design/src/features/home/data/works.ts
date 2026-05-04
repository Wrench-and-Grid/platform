export interface WorkItem {
  id: string
  number: string
  category: string
  title: string
  description: string
  tags: string[]
  year: string
  client: string
}

export const workItems: WorkItem[] = [
  {
    id: 'apex-dashboard',
    number: '01',
    category: 'Product Design',
    title: 'Apex Financial Dashboard',
    client: 'Apex Capital',
    year: '2025',
    description:
      'End-to-end redesign of a wealth management platform serving 40k+ users. Reduced task completion time by 34% through systematic component architecture.',
    tags: ['UX Design', 'Design System', 'Data Viz'],
  },
  {
    id: 'forma-identity',
    number: '02',
    category: 'Brand Identity',
    title: 'Forma Studio Identity',
    client: 'Forma Architecture',
    year: '2024',
    description:
      'Visual identity system for a New York architecture firm — wordmark, color system, typographic hierarchy, and branded collateral suite.',
    tags: ['Identity', 'Print', 'Brand System'],
  },
  {
    id: 'meridian-design-system',
    number: '03',
    category: 'Design Systems',
    title: 'Meridian Component Library',
    client: 'Meridian Health',
    year: '2024',
    description:
      'A 200+ component design system bridging design and engineering for a healthcare SaaS platform. Covers accessibility, dark mode, and multi-tenant theming.',
    tags: ['Design System', 'Accessibility', 'Healthcare'],
  },
  {
    id: 'clarity-platform',
    number: '04',
    category: 'Web Design',
    title: 'Clarity Content Platform',
    client: 'Clarity Media',
    year: '2025',
    description:
      'Marketing site and editorial platform for a media startup. Designed for clarity, speed, and reader trust — zero third-party bloat.',
    tags: ['Web Design', 'Editorial', 'Performance'],
  },
]

export const featuredWorkItems = workItems.slice(0, 4)
