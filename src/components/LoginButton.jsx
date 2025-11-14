import PropTypes from 'prop-types';

export default function LoginButton({ user }) {
  if (user) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
        <img
          className="h-8 w-8 rounded-full border border-white/20"
          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
          alt={user.username}
        />
        <div>
          <p className="text-sm font-semibold text-white">{user.username}</p>
          <p className="text-xs uppercase tracking-widest text-slate-500">Conectado</p>
        </div>
        <form method="post" action="/api/auth/logout">
          <button
            type="submit"
            className="rounded-md border border-danger/40 bg-danger/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-danger hover:bg-danger/30 transition"
          >
            Salir
          </button>
        </form>
      </div>
    );
  }

  return (
    <a
      href="/api/auth/login"
      className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-primary hover:bg-primary/30 transition"
    >
      Conectar Discord
    </a>
  );
}

LoginButton.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string
  })
};

