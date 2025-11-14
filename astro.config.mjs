import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';

// Usar adaptador de Node para Railway, Vercel para producción
// Railway establece PORT en runtime, Vercel establece VERCEL
// En modo standalone, el puerto se lee de process.env.PORT en runtime
const adapter = process.env.VERCEL 
  ? vercel()
  : node({ 
      mode: 'standalone',
      hostname: '0.0.0.0'
      // No especificar port aquí - el servidor generado leerá PORT del entorno en runtime
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

