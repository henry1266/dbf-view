import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
}

export default config