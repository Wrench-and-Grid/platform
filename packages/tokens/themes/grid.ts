import { theme as base } from './base.ts'

// Grid Design theme — extends base with an accent color system
export const theme = {
  ...base,
  colors: {
    ...base.colors,
    accent: {
      DEFAULT: '#aa3bff',
      dark: '#c084fc',
      bg: 'rgba(170, 59, 255, 0.1)',
      border: 'rgba(170, 59, 255, 0.5)',
    },
  },
} as const
