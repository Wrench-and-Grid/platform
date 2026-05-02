// Brand palette — exact values from dg.lxd-portfolio CSS custom properties
export const brand = {
  offWhite: '#f7f5f2',
  orange: '#ff5b22',
  aqua: '#aee6ed',
  blue: '#3939ff',
  lavender: '#b8bfff',
  yellow: '#f4f386',
} as const

// Ink/text hierarchy — from dg.lxd-portfolio CSS custom properties
export const ink = {
  DEFAULT: '#111010',
  mid: '#5a5450',
  light: '#a09890',
} as const

// Neutral gray scale
export const neutral = {
  0: '#ffffff',
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  950: '#030712',
} as const

// Semantic colors
export const semantic = {
  success: '#22c55e',
  successBg: '#f0fdf4',
  error: '#ef4444',
  errorBg: '#fef2f2',
  warning: '#f59e0b',
  warningBg: '#fffbeb',
} as const

export const colors = { brand, ink, neutral, semantic } as const
