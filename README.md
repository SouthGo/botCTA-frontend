# Albion CTA System - Web Panel

Panel web para gestionar CTAs del gremio Albion Online.

## 🚀 Despliegue en Railway

### Variables de Entorno Requeridas

Configura las siguientes variables en Railway:

#### Públicas (marcar como "Public" en Railway):
- `PUBLIC_BACKEND_URL` - URL del backend (ej: `https://botcta-backend-production.up.railway.app`)
- `PUBLIC_ALLOWED_CALLERS` - IDs de Discord de los callers permitidos (separados por comas)

#### Privadas (NO marcar como "Public"):
- `DISCORD_CLIENT_ID` - ID de la aplicación Discord
- `DISCORD_CLIENT_SECRET` - Secret de la aplicación Discord
- `DISCORD_REDIRECT_URI` - URI de redirección OAuth (ej: `https://tu-dominio.up.railway.app/api/auth/callback`)

### Pasos para Desplegar en Railway

1. **Conectar repositorio a Railway:**
   - Ve a [Railway](https://railway.app)
   - Crea un nuevo proyecto
   - Selecciona "Deploy from GitHub repo"
   - Elige el repositorio `botCTA-frontend` (o el que contenga el frontend)
   - Railway detectará automáticamente el directorio `web` o puedes configurarlo manualmente

2. **Configurar Root Directory (si es necesario):**
   - En Settings → Source → Root Directory, establece: `web`

3. **Configurar variables de entorno:**
   - Ve a Variables en el servicio
   - Agrega todas las variables mencionadas arriba
   - **Importante:** Marca `PUBLIC_BACKEND_URL` y `PUBLIC_ALLOWED_CALLERS` como "Public"

4. **Configurar Discord OAuth:**
   - En Discord Developer Portal → OAuth2 → Redirects
   - Agrega la URL de callback de Railway:
     `https://tu-dominio.up.railway.app/api/auth/callback`
   - Actualiza `DISCORD_REDIRECT_URI` en Railway con esta URL

5. **Desplegar:**
   - Railway detectará automáticamente los cambios y desplegará
   - El build ejecutará `npm run build`
   - El servidor iniciará con `npm start`

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

