import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';

// Usar adaptador de Node para Railway, Vercel para producción
// Railway establece PORT, Vercel establece VERCEL
const adapter = process.env.VERCEL 
  ? vercel()
  : node({ 
      mode: 'standalone',
      hostname: '0.0.0.0'
    });

export default defineConfig({
  output: 'server',
  adapter,
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

