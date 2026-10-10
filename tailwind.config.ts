import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#001127', 900: '#001A3D', 800: '#062650', 700: '#0D376A' },
        gold: { dark: '#A96518', DEFAULT: '#D79A32', light: '#F2C66D', highlight: '#FFE6A6' },
        ivory: '#F8F7F3',
        cream: '#EEE9DE',
        silver: '#B9C2CF',
        muted: '#8795A8',
      },
      fontFamily: {
        display: ['var(--font-sora)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-manrope)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
