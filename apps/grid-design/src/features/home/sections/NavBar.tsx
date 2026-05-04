import { gridTheme } from '@repo/tokens/themes'

const { colors, spacing, fontSize, fontWeight } = gridTheme

export default function NavBar() {
  return (
    <nav className="gd-nav" style={{ borderBottom: `1px solid ${colors.border}` }}>
      <div className="gd-nav-inner" style={{ paddingInline: spacing['6'], paddingBlock: spacing['4'] }}>
        <a href="/" className="gd-logo" aria-label="Grid Design home">
          <img src="/logo.svg" alt="" className="gd-logo-mark" aria-hidden="true" />
        </a>

        <ul className="gd-nav-links" style={{ fontSize: fontSize.sm, color: colors.ink.mid }}>
          <li><a href="#work" className="gd-nav-link">Work</a></li>
          <li><a href="#insights" className="gd-nav-link">Insights</a></li>
          <li><a href="#about" className="gd-nav-link">About</a></li>
        </ul>

        <a
          href="#contact"
          className="gd-nav-cta"
          style={{
            fontSize: fontSize.sm,
            fontWeight: fontWeight.medium,
            color: colors.accent.DEFAULT,
            borderBottom: `1.5px solid ${colors.accent.DEFAULT}`,
            paddingBottom: '1px',
          }}
        >
          Start a Project
        </a>
      </div>
    </nav>
  )
}
