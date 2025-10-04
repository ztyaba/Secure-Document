import type { Config } from 'tailwindcss';
const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1f2937',
          accent: '#f59e0b',
          soft: '#fef3c7'
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
export default config;
