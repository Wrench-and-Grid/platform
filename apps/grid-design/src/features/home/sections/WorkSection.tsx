import { Container, Grid, Heading, Section, Stack } from '@repo/ui'
import { gridTheme } from '@repo/tokens/themes'
import { featuredWorkItems } from '../data/works'
import ProjectCard from '../components/ProjectCard'

const { colors, spacing, fontSize, fontWeight } = gridTheme

export default function WorkSection() {
  return (
    <Section id="work" paddingBlock={spacing['20']} style={{ borderBottom: `1px solid ${colors.border}` }}>
      <Container maxWidth="72rem">
        <Stack gap={spacing['12']}>
          {/* Section header — mirrors portfolio's .work-head pattern */}
          <Stack gap={spacing['3']}>
            <div
              style={{ fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: colors.ink.light, letterSpacing: '0.14em' }}
            >
              FEATURED WORK
            </div>
            <Heading
              as="h2"
              size="4xl"
              style={{ color: colors.ink.DEFAULT, letterSpacing: '-0.02em' }}
            >
              Selected Projects
            </Heading>
          </Stack>

          {/* Responsive card grid — auto-fit mirrors portfolio's .work-list */}
          <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap={spacing['6']}>
            {featuredWorkItems.map((item) => (
              <ProjectCard key={item.id} item={item} />
            ))}
          </Grid>

          {/* Section CTA — mirrors portfolio's .work-entry RouteEntryLink */}
          <div style={{ textAlign: 'center', paddingTop: spacing['4'] }}>
            <a
              href="#"
              className="gd-see-all"
              style={{
                fontSize: fontSize.sm,
                fontWeight: fontWeight.medium,
                color: colors.ink.mid,
                letterSpacing: '0.1em',
              }}
            >
              — All Projects —
            </a>
          </div>
        </Stack>
      </Container>
    </Section>
  )
}
