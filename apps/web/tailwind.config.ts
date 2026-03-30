import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-page)",
        foreground: "var(--text-primary)",
        glass: {
          DEFAULT: "var(--bg-glass)",
          hover: "var(--bg-glass-hover)",
          deep: "var(--bg-glass-deep)",
          sidebar: "var(--bg-sidebar)",
          border: "var(--border-glass)",
        },
        accent: {
          blue: {
            DEFAULT: "var(--accent-blue)",
            soft: "var(--accent-blue-soft)",
          },
          green: {
            DEFAULT: "var(--accent-green)",
            soft: "var(--accent-green-soft)",
          },
          purple: {
            DEFAULT: "var(--accent-purple)",
            soft: "var(--accent-purple-soft)",
          },
          amber: {
            DEFAULT: "var(--accent-amber)",
            soft: "var(--accent-amber-soft)",
          },
          red: "var(--accent-red)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: {
          subtle: "var(--border-subtle)",
        }
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        hover: "var(--shadow-hover)",
        top: "var(--shadow-top)",
      }
    },
  },
  plugins: [],
};
export default config;
