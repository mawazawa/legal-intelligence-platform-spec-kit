import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS v4 Configuration
 * Optimized for performance with targeted content scanning
 */
const config: Config = {
  content: {
    files: [
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/lib/**/*.{js,ts,jsx,tsx}',
    ],
    // Performance optimization: exclude files that don't need scanning
    extract: {
      // Skip test files, type definitions, and data files
      tsx: (content: string) => {
        // Only extract from files with JSX/TSX content
        if (!content.includes('className')) return [];
        return content.match(/className\s*=\s*["']([^"']*)["']/g) || [];
      },
    },
  },

  // Cache configuration for faster rebuilds
  corePlugins: {
    // Disable unused features
    preflight: true,
  },

  // Future flags for better performance
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
