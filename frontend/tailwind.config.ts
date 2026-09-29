import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07111f',
        panel: '#0c192a',
        surface: '#101f32',
        cyan: '#36d7e7',
        muted: '#8da2ba',
        risk: { low: '#49d6a0', medium: '#f0b84a', high: '#fa6572' },
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      boxShadow: {
        glow: '0 0 26px rgba(54, 215, 231, 0.11)',
        panel: '0 18px 60px rgba(1, 8, 18, 0.32)',
      },
      animation: { 'fade-in': 'fade-in 240ms ease-out both' },
      keyframes: { 'fade-in': { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } } },
    },
  },
  plugins: [],
} satisfies Config;
