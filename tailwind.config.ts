import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f7f6f2',
        ink: '#050505',
        baseBlue: '#0052ff',
        signalRed: '#ff2d2d',
        signalYellow: '#ffd400',
        signalGreen: '#16a34a',
      },
      fontFamily: {
        swiss: ['Arial', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
