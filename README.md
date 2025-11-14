# Albion CTA System - Web Panel

Panel web para gestionar CTAs del gremio Albion Online.

## 🚀 Despliegue en Vercel

### Variables de Entorno Requeridas

Configura las siguientes variables en Vercel:

#### Públicas (accesibles desde el cliente):
- `PUBLIC_BACKEND_URL` - URL del backend (ej: `https://botcta-backend-production.up.railway.app`)
- `PUBLIC_ALLOWED_CALLERS` - IDs de Discord de los callers permitidos (separados por comas)

#### Privadas (solo servidor):
- `DISCORD_CLIENT_ID` - ID de la aplicación Discord
- `DISCORD_CLIENT_SECRET` - Secret de la aplicación Discord
- `DISCORD_REDIRECT_URI` - URI de redirección OAuth (ej: `https://tu-dominio.vercel.app/api/auth/callback`)

### Pasos para Desplegar

1. **Conectar repositorio a Vercel:**
   - Ve a [Vercel](https://vercel.com)
   - Importa el repositorio de GitHub
   - Selecciona el directorio `web` como raíz del proyecto

2. **Configurar variables de entorno:**
   - En la configuración del proyecto, ve a "Environment Variables"
   - Agrega todas las variables mencionadas arriba

3. **Configurar Discord OAuth:**
   - En Discord Developer Portal, agrega la URL de callback:
     `https://tu-dominio.vercel.app/api/auth/callback`

4. **Desplegar:**
   - Vercel detectará automáticamente los cambios y desplegará

## 🛠️ Desarrollo Local

```bash
npm install
npm run dev
```

El servidor de desarrollo estará en `http://localhost:4321`

## 📦 Build

```bash
npm run build
npm run preview
```

