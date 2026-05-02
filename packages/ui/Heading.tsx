import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { fontSize, fontWeight, lineHeight } from '@repo/tokens'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type FontSizeKey = keyof typeof fontSize
type FontWeightKey = keyof typeof fontWeight

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  as?: HeadingLevel
  size?: FontSizeKey
  weight?: FontWeightKey
}

const defaultSizes: Record<HeadingLevel, FontSizeKey> = {
  h1: '5xl',
  h2: '3xl',
  h3: '2xl',
  h4: 'xl',
  h5: 'lg',
  h6: 'base',
}

export function Heading({
  children,
  as: Tag = 'h2',
  size,
  weight = 'semibold',
  style,
  ...props
}: HeadingProps) {
  const headingStyle: CSSProperties = {
    fontSize: fontSize[size ?? defaultSizes[Tag]],
    fontWeight: fontWeight[weight],
    lineHeight: lineHeight.tight,
    margin: 0,
    ...style,
  }
  return (
    <Tag style={headingStyle} {...props}>
      {children}
    </Tag>
  )
}
