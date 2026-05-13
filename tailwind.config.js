import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        cybershieldlight: {
          primary: '#0284c7',
          'primary-content': '#f8fafc',
          secondary: '#2563eb',
          'secondary-content': '#eff6ff',
          accent: '#0f766e',
          'accent-content': '#ecfeff',
          neutral: '#102033',
          'neutral-content': '#e2e8f0',
          'base-100': '#ffffff',
          'base-200': '#f4f8fb',
          'base-300': '#dbe5f0',
          'base-content': '#102033',
          info: '#0284c7',
          success: '#059669',
          warning: '#d97706',
          error: '#dc2626',
          '--rounded-box': '1rem',
          '--rounded-btn': '0.85rem',
          '--rounded-badge': '9999px',
          '--border-btn': '1px',
          '--tab-border': '1px',
        },
      },
      {
        cybershielddark: {
          primary: '#00d4ff',
          'primary-content': '#04131f',
          secondary: '#60a5fa',
          'secondary-content': '#08111f',
          accent: '#00ff9d',
          'accent-content': '#032617',
          neutral: '#08111f',
          'neutral-content': '#e2e8f0',
          'base-100': '#0f172a',
          'base-200': '#0a0e1a',
          'base-300': '#1e2d4a',
          'base-content': '#e2e8f0',
          info: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          '--rounded-box': '1rem',
          '--rounded-btn': '0.85rem',
          '--rounded-badge': '9999px',
          '--border-btn': '1px',
          '--tab-border': '1px',
        },
      },
    ],
    logs: false,
  },
}
