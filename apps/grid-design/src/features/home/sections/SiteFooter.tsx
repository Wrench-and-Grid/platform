import { Container, Stack, Text } from '@repo/ui'
import { gridTheme } from '@repo/tokens/themes'

const { colors, spacing, fontSize, fontWeight } = gridTheme

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="contact"
      style={{
        background: colors.ink.DEFAULT,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <Container maxWidth="72rem">
        <div
          className="gd-footer-inner"
          style={{ paddingBlock: spacing['12'] }}
        >
          {/* Logo + tagline */}
          <Stack gap={spacing['2']}>
            <span
              style={{ color: colors.neutral[0], fontSize: fontSize.sm, fontWeight: fontWeight.bold, letterSpacing: '0.12em' }}
            >
              GRID DESIGN
            </span>
            <Text size="xs" style={{ color: colors.ink.light }}>
              Systematic design for meaningful outcomes.
            </Text>
          </Stack>

          {/* Footer nav */}
          <nav aria-label="Footer navigation">
            <Stack direction="row" gap={spacing['8']} style={{ fontSize: fontSize.sm, color: colors.ink.light }}>
              <a href="#work" className="gd-footer-link">Work</a>
              <a href="#insights" className="gd-footer-link">Insights</a>
              <a href="mailto:hello@griddesign.co" className="gd-footer-link">Contact</a>
            </Stack>
          </nav>

          {/* Copyright */}
          <Text size="xs" style={{ color: colors.ink.light }}>
            © {year} Grid Design Studio
          </Text>
        </div>
      </Container>
    </footer>
  )
}
