import {
  createSessionCookie,
  exchangeCodeForToken,
  fetchDiscordUser
} from '../../../lib/auth.js';

export async function GET({ url, cookies, redirect }) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies.get('discord_state')?.value;

  if (!code || !state || !storedState || storedState !== state) {
    return new Response('Estado inválido', { status: 400 });
  }

  cookies.delete('discord_state', { path: '/' });

  const redirectUri = import.meta.env.DISCORD_REDIRECT_URI;
  if (!redirectUri) {
    return new Response('DISCORD_REDIRECT_URI no configurado', { status: 500 });
  }

  try {
    const token = await exchangeCodeForToken({ code, redirectUri });
    const user = await fetchDiscordUser(token);
    const sessionValue = createSessionCookie(user);

    cookies.set('session', sessionValue, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: import.meta.env.PROD,
      maxAge: 60 * 60 * 24 * 7
    });
  } catch (error) {
    console.error('[web] Error completando OAuth', error);
    return new Response('Error autenticando con Discord', { status: 500 });
  }

  return redirect('/ctas');
}

