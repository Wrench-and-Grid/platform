import type { Config } from "tailwindcss";
import { fontFamily, shadows } from "@repo/tokens";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      // Colors stay as CSS-variable references — no change to visual output
      colors: {
        brand: {
          orange: "var(--clr-orange)",
          aqua: "var(--clr-aqua)",
          blue: "var(--clr-blue)",
          lavender: "var(--clr-lavender)",
          yellow: "var(--clr-yellow)",
          offwhite: "var(--clr-off-white)",
          ink: "var(--clr-ink)",
          inkmid: "var(--clr-ink-mid)",
          inklight: "var(--clr-ink-light)",
        },
      },
      fontFamily: {
        display: fontFamily.display,
        serif: fontFamily.serif,
        sans: fontFamily.sans,
      },
      boxShadow: {
        frame: shadows.frame,
        mural: shadows.mural,
        editorial: shadows.editorial,
      },
    },
  },
} satisfies Config;
