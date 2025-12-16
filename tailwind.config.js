/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f0f1a',
          800: '#1a1a2e',
          700: '#252542',
          600: '#2d2d4a',
        },
        primary: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
          muted: 'rgba(99, 102, 241, 0.1)',
        },
        // Theme-aware colors
        theme: {
          bg: {
            primary: 'var(--color-bg-primary)',
            secondary: 'var(--color-bg-secondary)',
            tertiary: 'var(--color-bg-tertiary)',
            hover: 'var(--color-bg-hover)',
            card: 'var(--color-bg-card)',
          },
          border: {
            DEFAULT: 'var(--color-border)',
            light: 'var(--color-border-light)',
          },
          text: {
            primary: 'var(--color-text-primary)',
            secondary: 'var(--color-text-secondary)',
            muted: 'var(--color-text-muted)',
            label: 'var(--color-label)',
            caption: 'var(--color-caption)',
          },
          accent: {
            DEFAULT: 'var(--color-accent)',
            hover: 'var(--color-accent-hover)',
          },
          // Component-specific tokens
          input: {
            bg: 'var(--input-bg)',
            border: 'var(--input-border)',
            text: 'var(--input-text)',
            placeholder: 'var(--input-placeholder)',
            'border-focus': 'var(--input-border-focus)',
          },
          select: {
            bg: 'var(--select-bg)',
            border: 'var(--select-border)',
            'option-bg': 'var(--select-option-bg)',
            'option-hover': 'var(--select-option-hover)',
            'option-selected': 'var(--select-option-selected)',
          },
          textarea: {
            bg: 'var(--textarea-bg)',
            border: 'var(--textarea-border)',
            text: 'var(--textarea-text)',
          },
          button: {
            secondary: 'var(--button-secondary-bg)',
            'secondary-hover': 'var(--button-secondary-hover)',
            'secondary-text': 'var(--button-secondary-text)',
            'secondary-border': 'var(--button-secondary-border)',
            'ghost-hover': 'var(--button-ghost-hover)',
            'outline-border': 'var(--button-outline-border)',
          },
          badge: {
            bg: 'var(--badge-default-bg)',
            text: 'var(--badge-default-text)',
            border: 'var(--badge-default-border)',
          },
          card: {
            bg: 'var(--card-bg)',
            border: 'var(--card-border)',
            'hover-border': 'var(--card-hover-border)',
          },
          overlay: {
            bg: 'var(--overlay-bg)',
            backdrop: 'var(--overlay-backdrop)',
          },
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
