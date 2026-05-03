import { theme as base } from './base.ts'

// Grid Design Studio theme — systematic, cool, client-focused.
// Deliberately different from the portfolio's warm expressive palette.
export const theme = {
  ...base,
  colors: {
    ...base.colors,
    // Override ink with cooler gray-blue tones (vs portfolio's warm #111010)
    ink: {
      DEFAULT: '#0a0a0f',
      mid: '#64647a',
      light: '#a0a0b0',
    },
    // Grid Blue accent — precise, technical, professional
    accent: {
      DEFAULT: '#0057ff',
      dark: '#0040cc',
      bg: 'rgba(0, 87, 255, 0.06)',
      border: 'rgba(0, 87, 255, 0.2)',
    },
    // Studio surface + border
    surface: '#f4f4f6',
    border: '#e2e2e7',
  },
} as const
