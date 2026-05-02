import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { spacing } from '@repo/tokens'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  maxWidth?: string
}

export function Container({ children, maxWidth = '72rem', style, ...props }: ContainerProps) {
  const containerStyle: CSSProperties = {
    width: '100%',
    maxWidth,
    marginInline: 'auto',
    paddingInline: spacing['6'],
    ...style,
  }
  return (
    <div style={containerStyle} {...props}>
      {children}
    </div>
  )
}
