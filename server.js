// Wrapper para el servidor de Astro que asegura que use el puerto correcto de Railway
// El adaptador de Astro Node en modo standalone debe leer PORT del entorno
// Este script asegura que PORT esté disponible antes de importar el servidor

// Asegurar que PORT esté configurado (Railway lo proporciona automáticamente)
if (!process.env.PORT) {
  console.warn('[server] PORT no está definido, usando puerto 3000 por defecto');
  process.env.PORT = '3000';
}

// Importar y ejecutar el servidor generado por Astro
try {
  await import('./dist/server/entry.mjs');
} catch (error) {
  console.error('[server] Error iniciando servidor:', error);
  process.exit(1);
}

