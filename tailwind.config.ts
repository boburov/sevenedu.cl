import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",

        // Text
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",

        // Borders
        border: "var(--border)",
        "border-strong": "var(--border-strong)",

        // Primary purple
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-soft": "var(--primary-soft)",
        "primary-foreground": "var(--primary-foreground)",

        // Focus
        "focus-ring": "var(--focus-ring)",

        // Status
        success: "var(--success)",
        "success-soft": "var(--success-soft)",
        warning: "var(--warning)",
        "warning-soft": "var(--warning-soft)",
        danger: "var(--danger)",
        "danger-soft": "var(--danger-soft)",
        info: "var(--info)",
        "info-soft": "var(--info-soft)",
      },
      borderRadius: {
        card: "1rem",
        button: "0.75rem",
        input: "0.75rem",
      },
      spacing: {
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(26, 22, 37, 0.04), 0 4px 12px rgba(124, 58, 237, 0.06)",
        "card-hover":
          "0 2px 8px rgba(26, 22, 37, 0.06), 0 8px 24px rgba(124, 58, 237, 0.1)",
        soft: "0 2px 8px rgba(26, 22, 37, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
