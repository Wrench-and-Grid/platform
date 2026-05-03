import { Container, Grid, Heading, Section, Stack } from '@repo/ui'
import { gridTheme } from '@repo/tokens/themes'
import { featuredPosts } from '../data/posts'
import PostCard from './PostCard'

const { colors, spacing, fontSize, fontWeight } = gridTheme

export default function BlogSection() {
  return (
    <Section
      id="insights"
      paddingBlock={spacing['20']}
      style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}` }}
    >
      <Container maxWidth="72rem">
        <Stack gap={spacing['12']}>
          {/* Section header — mirrors portfolio's .blog-head pattern */}
          <Stack gap={spacing['3']}>
            <div
              style={{ fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: colors.ink.light, letterSpacing: '0.14em' }}
            >
              INSIGHTS
            </div>
            <Heading
              as="h2"
              size="4xl"
              style={{ color: colors.ink.DEFAULT, letterSpacing: '-0.02em' }}
            >
              Studio Thinking
            </Heading>
          </Stack>

          {/* Three-column blog grid */}
          <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap={spacing['6']}>
            {featuredPosts.map((post) => (
              <PostCard key={post.id} item={post} />
            ))}
          </Grid>

          {/* Section CTA */}
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
              — All Posts —
            </a>
          </div>
        </Stack>
      </Container>
    </Section>
  )
}
