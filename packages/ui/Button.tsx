import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { colors, spacing, radius } from '@repo/tokens'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}

const variants: Record<string, CSSProperties> = {
  primary: { background: colors.ink.DEFAULT, color: colors.neutral[0] },
  secondary: { background: colors.neutral[200], color: colors.ink.DEFAULT },
  ghost: { background: 'transparent', color: 'inherit', border: '1px solid currentColor' },
}

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${spacing['2']} ${spacing['5']}`,
  borderRadius: radius.md,
  fontWeight: 500,
  fontSize: '0.875rem',
  cursor: 'pointer',
  border: 'none',
  transition: 'opacity 0.15s ease',
}

export function Button({ children, variant = 'primary', style, ...props }: ButtonProps) {
  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  )
}
