import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { spacing } from '@repo/tokens'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  direction?: 'row' | 'column'
  gap?: string
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  wrap?: boolean
}

export function Stack({
  children,
  direction = 'column',
  gap = spacing['4'],
  align,
  justify,
  wrap = false,
  style,
  ...props
}: StackProps) {
  const stackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    gap,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : undefined,
    ...style,
  }
  return (
    <div style={stackStyle} {...props}>
      {children}
    </div>
  )
}
