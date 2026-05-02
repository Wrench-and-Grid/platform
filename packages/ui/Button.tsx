import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ children, variant = 'primary', style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem 1.25rem',
    borderRadius: '0.375rem',
    fontWeight: 500,
    fontSize: '0.875rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'opacity 0.15s ease',
  }

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: '#0f172a', color: '#fff' },
    secondary: { background: '#e2e8f0', color: '#0f172a' },
    ghost: { background: 'transparent', color: 'inherit', border: '1px solid currentColor' },
  }

  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  )
}
