import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS v4 Configuration
 * Optimized for performance with targeted content scanning
 */
const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
