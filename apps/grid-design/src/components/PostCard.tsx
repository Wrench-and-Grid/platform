import { Heading, Stack, Text } from '@repo/ui'
import { gridTheme } from '@repo/tokens/themes'
import type { PostItem } from '../data/posts'

const { colors, spacing, fontSize, fontWeight, radius } = gridTheme

interface PostCardProps {
  item: PostItem
}

export default function PostCard({ item }: PostCardProps) {
  return (
    <article
      className="gd-post-card"
      style={{
        borderRadius: radius.DEFAULT,
        border: `1px solid ${colors.border}`,
        background: '#fff',
        padding: spacing['6'],
      }}
    >
      <Stack gap={spacing['5']}>
        {/* Meta row — date + category */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontSize: fontSize.xs,
              fontWeight: fontWeight.medium,
              color: colors.accent.DEFAULT,
              letterSpacing: '0.08em',
            }}
          >
            {item.category}
          </span>
          <time
            dateTime={item.isoDate}
            style={{ fontSize: fontSize.xs, color: colors.ink.light }}
          >
            {item.date}
          </time>
        </div>

        {/* Title + excerpt */}
        <Stack gap={spacing['2']}>
          <Heading as="h3" size="lg" weight="semibold" style={{ color: colors.ink.DEFAULT, letterSpacing: '-0.01em', lineHeight: '1.3' }}>
            {item.title}
          </Heading>
          <Text size="sm" style={{ color: colors.ink.mid, lineHeight: '1.65' }}>
            {item.excerpt}
          </Text>
        </Stack>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing['1'] }}>
          {item.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: fontSize.xs,
                color: colors.ink.mid,
                background: colors.surface,
                padding: `2px ${spacing['2']}`,
                borderRadius: '2px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href="#"
          className="gd-card-cta"
          style={{
            fontSize: fontSize.sm,
            fontWeight: fontWeight.medium,
            color: colors.accent.DEFAULT,
            textDecoration: 'none',
          }}
        >
          Read →
        </a>
      </Stack>
    </article>
  )
}
