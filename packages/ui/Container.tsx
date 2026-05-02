import type { HTMLAttributes, ReactNode } from 'react'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  maxWidth?: string
}

export function Container({ children, maxWidth = '72rem', style, ...props }: ContainerProps) {
  return (
    <div
      style={{ width: '100%', maxWidth, marginInline: 'auto', paddingInline: '1.5rem', ...style }}
      {...props}
    >
      {children}
    </div>
  )
}
