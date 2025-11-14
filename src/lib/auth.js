import { Buffer } from 'node:buffer';

const DISCORD_BASE_URL = 'https://discord.com/api';

export function createDiscordAuthUrl({ redirectUri, scopes = ['identify', 'guilds'], state }) {
  const params = new URLSearchParams({
    client_id: import.meta.env.DISCORD_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes.join(' ')
  });

  if (state) {
    params.set('state', state);
  }

  return `${DISCORD_BASE_URL}/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken({ code, redirectUri }) {
  const params = new URLSearchParams({
    client_id: import.meta.env.DISCORD_CLIENT_ID,
    client_secret: import.meta.env.DISCORD_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri
  });

  const response = await fetch(`${DISCORD_BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });

  if (!response.ok) {
    throw new Error(`Discord token error ${response.status}`);
  }

  return response.json();
}

export async function fetchDiscordUser(token) {
  const response = await fetch(`${DISCORD_BASE_URL}/users/@me`, {
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Discord user error ${response.status}`);
  }

  return response.json();
}

export function createSessionCookie(user) {
  const session = {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    discriminator: user.discriminator,
    createdAt: Date.now()
  };

  return Buffer.from(JSON.stringify(session)).toString('base64url');
}

export function readSessionCookie(cookieValue) {
  if (!cookieValue) return null;
  try {
    const decoded = Buffer.from(cookieValue, 'base64url').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('[web] Error leyendo cookie de sesión', error);
    return null;
  }
}

