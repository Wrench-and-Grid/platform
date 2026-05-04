export interface PostItem {
  id: string
  issue: string
  category: string
  title: string
  excerpt: string
  date: string
  isoDate: string
  tags: string[]
}

export const postItems: PostItem[] = [
  {
    id: 'grid-systems-spaces',
    issue: '01',
    category: 'Process',
    title: 'Grid systems and the spaces between',
    excerpt:
      'Why the invisible structure of a layout matters more than any individual element you place inside it.',
    date: 'April 18, 2025',
    isoDate: '2025-04-18',
    tags: ['Grids', 'Layout', 'Fundamentals'],
  },
  {
    id: 'why-design-systems-fail',
    issue: '02',
    category: 'Systems',
    title: 'Why design systems fail (and how to fix them)',
    excerpt:
      'Most design systems die not from lack of polish, but from lack of adoption. The real problem is almost always governance.',
    date: 'March 6, 2025',
    isoDate: '2025-03-06',
    tags: ['Design Systems', 'Teams', 'Adoption'],
  },
  {
    id: 'brief-before-brief',
    issue: '03',
    category: 'Client Work',
    title: 'The brief before the brief',
    excerpt:
      'The questions you ask before signing an engagement often determine more about the outcome than anything that comes after.',
    date: 'Feb 11, 2025',
    isoDate: '2025-02-11',
    tags: ['Discovery', 'Process', 'Clients'],
  },
]

export const featuredPosts = postItems.slice(0, 3)
