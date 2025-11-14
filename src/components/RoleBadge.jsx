import PropTypes from 'prop-types';

const ROLE_COLORS = {
  tank: 'bg-blue-500/30 text-blue-200 border-blue-400/40',
  healer: 'bg-emerald-500/30 text-emerald-200 border-emerald-400/40',
  support: 'bg-purple-500/30 text-purple-200 border-purple-400/40',
  dps_melee: 'bg-rose-500/30 text-rose-200 border-rose-400/40',
  dps_ranged: 'bg-orange-500/30 text-orange-200 border-orange-400/40',
  scout: 'bg-slate-500/30 text-slate-200 border-slate-400/40'
};

export default function RoleBadge({ role, count }) {
  const style = ROLE_COLORS[role] ?? 'bg-white/10 text-slate-200 border-slate-400/20';
  const label = role.replace('_', ' ');

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-widest ${style}`}>
      <span>{label}</span>
      {count !== undefined && <strong className="text-white">{count}</strong>}
    </span>
  );
}

RoleBadge.propTypes = {
  role: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

