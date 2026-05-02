import { Button, Container, Heading, Section, Stack, Text } from '@repo/ui'
import { theme } from '@repo/tokens/themes/grid'
import './index.css'

export default function App() {
  const { colors, spacing } = theme

  return (
    <Container maxWidth="64rem">
      <Section paddingBlock={spacing['24']}>
        <Stack gap={spacing['8']}>
          <Stack gap={spacing['4']}>
            <Heading as="h1" size="7xl" style={{ color: colors.ink.DEFAULT }}>
              Grid Design
            </Heading>
            <Text size="lg" muted style={{ maxWidth: '40rem' }}>
              A design system playground built on a shared monorepo platform.
              Components, tokens, and themes — composable by default.
            </Text>
          </Stack>

          <Stack direction="row" gap={spacing['3']} wrap>
            <Button
              variant="primary"
              style={{ background: colors.accent.DEFAULT, color: '#fff' }}
            >
              Get started
            </Button>
            <Button variant="ghost">View components</Button>
          </Stack>
        </Stack>
      </Section>

      <Section
        as="div"
        paddingBlock={spacing['16']}
        style={{ borderTop: `1px solid ${colors.neutral[200]}` }}
      >
        <Stack gap={spacing['6']}>
          <Heading as="h2" size="xl" weight="medium" style={{ color: colors.ink.mid }}>
            Token preview
          </Heading>
          <Stack direction="row" gap={spacing['3']} wrap>
            {Object.entries(colors.accent).map(([key, value]) => (
              <Stack key={key} gap={spacing['2']} align="center">
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: theme.radius.lg,
                    background: value,
                    border: `1px solid ${colors.neutral[200]}`,
                  }}
                />
                <Text size="xs" muted>
                  {key}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Section>
    </Container>
  )
}
