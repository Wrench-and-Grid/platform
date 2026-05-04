import { Heading, Stack, Text } from '@repo/ui'
import { gridTheme } from '@repo/tokens/themes'
import type { WorkItem } from '../data/works'

const { colors, spacing, fontSize, fontWeight, radius } = gridTheme

interface ProjectCardProps {
  item: WorkItem
}

export default function ProjectCard({ item }: ProjectCardProps) {
  return (
    <article className="gd-project-card" style={{ borderRadius: radius.DEFAULT, border: `1px solid ${colors.border}`, background: colors.neutral[0] }}>
      <div
        className="gd-project-card-head"
        style={{
          padding: `${spacing['5']} ${spacing['6']}`,
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: colors.ink.light, letterSpacing: '0.1em' }}>
          {item.number}
        </span>
        <span
          style={{
            fontSize: fontSize.xs,
            fontWeight: fontWeight.medium,
            color: colors.accent.DEFAULT,
            background: colors.accent.bg,
            border: `1px solid ${colors.accent.border}`,
            padding: `2px ${spacing['2']}`,
            borderRadius: '2px',
            letterSpacing: '0.06em',
          }}
        >
          {item.category}
        </span>
      </div>

      <Stack gap={spacing['4']} style={{ padding: spacing['6'] }}>
        <Stack gap={spacing['2']}>
          <Heading as="h3" size="xl" weight="semibold" style={{ color: colors.ink.DEFAULT, letterSpacing: '-0.01em' }}>
            {item.title}
          </Heading>
          <Text size="xs" style={{ color: colors.ink.light }}>
            {item.client} · {item.year}
          </Text>
        </Stack>

        <Text size="sm" style={{ color: colors.ink.mid, lineHeight: '1.6' }}>
          {item.description}
        </Text>

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
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing['1'],
          }}
        >
          View Project →
        </a>
      </Stack>
    </article>
  )
}
