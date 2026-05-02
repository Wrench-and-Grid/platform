import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
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
        display: ["Bebas Neue", "sans-serif"],
        serif: ["Fraunces", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        frame: "0 32px 80px rgba(17, 16, 16, 0.12)",
        mural: "0 36px 90px rgba(0, 0, 0, 0.28)",
        editorial: "0 18px 42px rgba(17, 16, 16, 0.08)",
      },
    },
  },
} satisfies Config;
