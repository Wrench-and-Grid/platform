import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { fontSize, fontWeight, lineHeight } from '@repo/tokens'

type TextTag = 'p' | 'span' | 'div' | 'label' | 'small'
type FontSizeKey = keyof typeof fontSize
type FontWeightKey = keyof typeof fontWeight

export interface TextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  as?: TextTag
  size?: FontSizeKey
  weight?: FontWeightKey
  muted?: boolean
}

export function Text({
  children,
  as: Tag = 'p',
  size = 'base',
  weight = 'normal',
  muted = false,
  style,
  ...props
}: TextProps) {
  const textStyle: CSSProperties = {
    fontSize: fontSize[size],
    fontWeight: fontWeight[weight],
    lineHeight: lineHeight.normal,
    margin: 0,
    opacity: muted ? 0.6 : undefined,
    ...style,
  }
  return (
    <Tag style={textStyle} {...props}>
      {children}
    </Tag>
  )
}
