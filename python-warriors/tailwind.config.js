/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-space': 'rgb(var(--bg-primary) / <alpha-value>)', // Main BG with alpha support
        'neon-cyan': 'rgb(var(--accent-primary) / <alpha-value>)',
        'neon-magenta': 'rgb(var(--accent-secondary) / <alpha-value>)',
        'glass-bg': 'rgb(var(--bg-primary) / 0.7)',
        'glass-border': 'rgb(var(--accent-primary) / 0.3)',
        'theme-text': 'rgb(var(--text-primary) / <alpha-value>)',
        'theme-bg': 'rgb(var(--bg-primary) / <alpha-value>)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(0, 243, 255, 0.5), 0 0 20px rgba(0, 243, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(255, 0, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
