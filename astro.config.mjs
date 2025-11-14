import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
  adapter: '@astrojs/vercel/serverless',
  integrations: [
    react(),
    tailwind({
      config: {
        applyBaseStyles: false
      }
    })
  ],
  envPrefix: 'PUBLIC_'
});

