// Named shadows — portfolio-specific editorial shadows + utility scale
export const shadows = {
  // Portfolio brand shadows (exact values from tailwind.config.ts)
  frame: '0 32px 80px rgba(17, 16, 16, 0.12)',
  mural: '0 36px 90px rgba(0, 0, 0, 0.28)',
  editorial: '0 18px 42px rgba(17, 16, 16, 0.08)',

  // Utility scale
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  none: 'none',
} as const
