import PropTypes from 'prop-types';
import RoleBadge from './RoleBadge.jsx';

export default function CtaCard({ cta, onSelect, href }) {
  const handleClick = () => {
    onSelect?.(cta);
  };

  const ActionComponent = href ? 'a' : 'button';
  const actionProps = href
    ? { href }
    : { type: 'button', onClick: handleClick };

  return (
    <article className="rounded-xl border border-white/5 bg-surface/60 p-4 shadow-lg shadow-primary/5 hover:border-primary/40 transition">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            CTA #{cta.id?.slice(0, 8)}
          </p>
          <h3 className="text-xl font-semibold text-white">{cta.title}</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-slate-300">
          {cta.status ?? 'open'}
        </span>
      </header>
      <p className="mt-3 text-sm text-slate-300 line-clamp-3">{cta.description}</p>
      <dl className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400 uppercase tracking-widest">
        <div>
          <dt>Fecha</dt>
          <dd className="text-sm normal-case text-slate-200">
            {cta.date ? new Date(cta.date).toLocaleString() : 'Sin definir'}
          </dd>
        </div>
        <div>
          <dt>Creada por</dt>
          <dd className="text-sm normal-case text-slate-200">{cta.created_by}</dd>
        </div>
      </dl>
      {cta.compo && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(cta.compo).map(([role, amount]) => (
            <RoleBadge key={role} role={role} count={amount} />
          ))}
        </div>
      )}
      <footer className="mt-6 flex justify-end">
        <ActionComponent
          {...actionProps}
          className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/30 transition"
        >
          Ver detalles
        </ActionComponent>
      </footer>
    </article>
  );
}

CtaCard.propTypes = {
  cta: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    compo: PropTypes.object,
    date: PropTypes.string,
    created_by: PropTypes.string
  }).isRequired,
  onSelect: PropTypes.func,
  href: PropTypes.string
};

