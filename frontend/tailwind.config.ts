import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  theme: {
    extend: {
      colors: {
        bg: {
          base:     'rgb(var(--color-bg-base) / <alpha-value>)',
          surface1: 'rgb(var(--color-bg-surface-1) / <alpha-value>)',
          surface2: 'rgb(var(--color-bg-surface-2) / <alpha-value>)',
          surface3: 'rgb(var(--color-bg-surface-3) / <alpha-value>)',
          surface4: 'rgb(var(--color-bg-surface-4) / <alpha-value>)',
        },

        text: {
          primary:   'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted:     'rgb(var(--color-text-muted) / <alpha-value>)',
          link:      'rgb(var(--color-text-link) / <alpha-value>)',
        },

        border: {
          subtle:  'rgb(var(--color-border-subtle))',
          DEFAULT: 'rgb(var(--color-border-default))',
          focus:   'rgb(var(--color-border-focus) / <alpha-value>)',
        },

        brand: {
          subtle:  'rgb(var(--color-brand-subtle) / <alpha-value>)',
          muted:   'rgb(var(--color-brand-muted) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-brand-default) / <alpha-value>)',
          hover:   'rgb(var(--color-brand-hover) / <alpha-value>)',
          light:   'rgb(var(--color-brand-light) / <alpha-value>)',
        },

        info: {
          bg:   'rgb(var(--color-info-bg) / <alpha-value>)',
          text: 'rgb(var(--color-info-text) / <alpha-value>)',
        },

        success: {
          bg:   'rgb(var(--color-success-bg) / <alpha-value>)',
          text: 'rgb(var(--color-success-text) / <alpha-value>)',
        },

        warning: {
          bg:   'rgb(var(--color-warning-bg) / <alpha-value>)',
          text: 'rgb(var(--color-warning-text) / <alpha-value>)',
        },

        danger: {
          bg:   'rgb(var(--color-danger-bg) / <alpha-value>)',
          text: 'rgb(var(--color-danger-text) / <alpha-value>)',
        },

        purple: {
          bg:   'rgb(var(--color-purple-bg) / <alpha-value>)',
          text: 'rgb(var(--color-purple-text) / <alpha-value>)',
        },
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },

  plugins: [],
};

export default config;