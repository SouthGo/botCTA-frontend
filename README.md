# Albion CTA System - Web Panel

Panel web para gestionar CTAs del gremio Albion Online. Sistema completo de gestión de CTAs (Call To Arms) con autenticación mediante Discord OAuth.

## 📋 Rutas y Funcionalidades

### Páginas Públicas

#### `/` (Página Principal)
- **Descripción**: Redirige automáticamente a `/ctas`
- **Acceso**: Público
- **Funcionalidad**: Redirección simple

#### `/ctas` (Listado de CTAs)
- **Descripción**: Muestra todas las CTAs activas (estado `open`)
- **Acceso**: Público
- **Funcionalidades**:
  - Visualizar todas las CTAs activas en formato de tarjetas
  - Ver información básica: título, descripción, fecha, estado, composición
  - Botón para crear nueva CTA (requiere autenticación)
  - Enlaces a los detalles de cada CTA

#### `/ctas/[id]` (Detalles de CTA)
- **Descripción**: Vista detallada de una CTA específica
- **Acceso**: Público
- **Funcionalidades**:
  - Ver información completa de la CTA (título, descripción, fecha, estado)
  - Visualizar composición objetivo
  - Ver tabla de postulantes con sus roles propuestos y roles finales
  - **Para usuarios autenticados**:
    - Botón para postularse a la CTA (solo CTAs abiertas)
    - Editar postulación existente
    - Retirarse de la CTA
  - **Para callers** (usuarios autorizados):
    - Asignar roles finales a postulantes
    - Cerrar la CTA

#### `/ctas/create` (Crear CTA)
- **Descripción**: Formulario para crear una nueva CTA
- **Acceso**: Requiere autenticación (redirige a login si no está autenticado)
- **Funcionalidades**:
  - Formulario completo con validación
  - Campos: título (requerido), descripción, fecha y hora (requerido)
  - Configuración de composición objetivo (opcional):
    - Tank, Healer, DPS Melee, DPS Ranged, Support, Scout
  - Redirección automática a la página de detalles después de crear

#### `/history` (Historial)
- **Descripción**: Lista de CTAs cerradas (estado `closed`)
- **Acceso**: Público
- **Funcionalidades**:
  - Tabla con todas las CTAs cerradas
  - Información: título, ID, fecha, creador, estado
  - Enlaces para ver el detalle de cada CTA cerrada

### Rutas de API (Autenticación)

#### `/api/auth/login`
- **Descripción**: Inicia el flujo de autenticación OAuth con Discord
- **Acceso**: Público
- **Funcionalidad**: Redirige a Discord OAuth y establece cookie de estado

#### `/api/auth/callback`
- **Descripción**: Callback de OAuth de Discord
- **Acceso**: Público (llamado por Discord)
- **Funcionalidad**: 
  - Intercambia código por token
  - Obtiene información del usuario
  - Establece cookie de sesión
  - Redirige a la página original o a `/ctas`

#### `/api/auth/logout`
- **Descripción**: Cierra la sesión del usuario
- **Acceso**: Público
- **Funcionalidad**: Elimina la cookie de sesión y redirige a `/ctas`

## 🔐 Autenticación y Permisos

### Autenticación
- **Método**: OAuth 2.0 con Discord
- **Scope**: `identify`, `guilds`
- **Cookie de sesión**: Se almacena información del usuario (ID, username, avatar)

### Roles y Permisos

#### Usuario No Autenticado
- ✅ Ver listado de CTAs
- ✅ Ver detalles de CTAs
- ✅ Ver historial de CTAs cerradas
- ❌ Crear CTAs
- ❌ Postularse a CTAs
- ❌ Asignar roles

#### Usuario Autenticado
- ✅ Todas las funcionalidades de usuario no autenticado
- ✅ Crear nuevas CTAs
- ✅ Postularse a CTAs abiertas
- ✅ Editar su postulación
- ✅ Retirarse de una CTA
- ❌ Asignar roles finales
- ❌ Cerrar CTAs

#### Caller (Usuario Autorizado)
- ✅ Todas las funcionalidades de usuario autenticado
- ✅ Asignar roles finales a postulantes
- ✅ Cerrar CTAs

**Configuración de Callers**: 
- Variable de entorno `PUBLIC_ALLOWED_CALLERS`
- Lista de IDs de Discord separados por comas
- Si está vacía o no definida, todos los usuarios autenticados son callers

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

## 🧩 Componentes Principales

### Componentes React (Client-Side)

- **`CreateCtaForm`**: Formulario para crear nuevas CTAs con validación
- **`PostulateButton`**: Botón con modal para postularse/editar/retirarse de CTAs
- **`AssignmentPanel`**: Panel interactivo para asignar roles finales a postulantes (callers)
- **`PostulantTable`**: Tabla que muestra postulantes con sus roles
- **`CtaCard`**: Tarjeta de CTA para el listado
- **`CloseCtaButton`**: Botón para cerrar CTAs (callers)
- **`RoleBadge`**: Badge visual para mostrar roles
- **`LoginButton`**: Botón de autenticación con Discord

### Layouts

- **`DashboardLayout`**: Layout principal de la aplicación con navegación y slots

### Utilidades

- **`api.js`**: Cliente API para comunicación con el backend
  - `listCtas()`: Lista todas las CTAs
  - `getCtaDetails(id)`: Obtiene detalles de una CTA
  - `createCta(payload)`: Crea una nueva CTA
  - `postular(payload)`: Postula a una CTA
  - `leaveCta(ctaId, userId)`: Retira a un usuario de una CTA
  - `assignRoles(payload)`: Asigna roles finales (callers)
  - `closeCta(ctaId)`: Cierra una CTA (callers)

- **`auth.js`**: Utilidades de autenticación con Discord OAuth
  - `createDiscordAuthUrl()`: Genera URL de autenticación
  - `exchangeCodeForToken()`: Intercambia código por token
  - `fetchDiscordUser()`: Obtiene información del usuario
  - `createSessionCookie()`: Crea cookie de sesión
  - `readSessionCookie()`: Lee cookie de sesión

## 🛠️ Tecnologías

- **Framework**: [Astro](https://astro.build/) - Framework web moderno
- **UI Components**: React (para interactividad)
- **Estilos**: Tailwind CSS
- **Autenticación**: Discord OAuth 2.0
- **API Client**: Fetch API nativo
- **Deploy**: Railway (configuración incluida)

## 📝 Notas

- Todas las funcionalidades principales están disponibles en la web
- El código del bot de Discord se mantiene intacto pero no es necesario para usar la web
- La autenticación es opcional para ver CTAs, pero requerida para crear y postularse
- Los callers pueden configurarse mediante variable de entorno

