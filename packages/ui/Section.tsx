import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { spacing } from '@repo/tokens'

type SectionTag = 'section' | 'article' | 'aside' | 'main' | 'div'

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  as?: SectionTag
  paddingBlock?: string
}

export function Section({
  children,
  as: Tag = 'section',
  paddingBlock = spacing['16'],
  style,
  ...props
}: SectionProps) {
  const sectionStyle: CSSProperties = { paddingBlock, ...style }
  return (
    <Tag style={sectionStyle} {...props}>
      {children}
    </Tag>
  )
}
