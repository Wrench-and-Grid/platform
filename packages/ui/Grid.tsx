import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { spacing } from '@repo/tokens'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  columns?: number | string
  gap?: string
}

export function Grid({
  children,
  columns = 12,
  gap = spacing['6'],
  style,
  ...props
}: GridProps) {
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns,
    gap,
    ...style,
  }
  return (
    <div style={gridStyle} {...props}>
      {children}
    </div>
  )
}
