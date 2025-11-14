import { nanoid } from 'nanoid';
import { createDiscordAuthUrl } from '../../../lib/auth.js';

export async function GET({ cookies, redirect }) {
  const redirectUri = import.meta.env.DISCORD_REDIRECT_URI;
  if (!redirectUri) {
    return new Response('DISCORD_REDIRECT_URI no configurado', { status: 500 });
  }

  const state = nanoid();
  cookies.set('discord_state', state, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: 60 * 10
  });

  const url = createDiscordAuthUrl({ redirectUri, state });
  return redirect(url);
}

