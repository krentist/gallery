// tailwind.config.js
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // This makes 'ABCOtto' the default sans-serif font for your site
        sans: ['ABCOtto', 'sans-serif'], // <--- Use your new font here!
      },
      spacing: {
        '2.5': '0.875rem'
      },
      screens: {
        '3xl': '2000px'
      }
    }
  },
  plugins: []
};
export default config;