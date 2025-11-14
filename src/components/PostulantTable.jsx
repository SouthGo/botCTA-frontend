import PropTypes from 'prop-types';

const ROLE_LABELS = {
  tank: 'Tank',
  healer: 'Healer',
  support: 'Support',
  dps_melee: 'DPS Melee',
  dps_ranged: 'DPS Ranged',
  scout: 'Scout'
};

export default function PostulantTable({ postulants, enableAssignment, onAssign }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-surface/60">
      <table className="min-w-full divide-y divide-white/5 text-sm">
        <thead className="bg-white/5 uppercase tracking-widest text-xs text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left">Jugador</th>
            <th className="px-4 py-3 text-left">Roles propuestos</th>
            <th className="px-4 py-3 text-left">Rol final</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-slate-200">
          {postulants.map((postulant) => (
            <tr key={`${postulant.cta_id}-${postulant.user_id}`} className="hover:bg-white/5 transition">
              <td className="px-4 py-3 font-semibold">{postulant.user_name}</td>
              <td className="px-4 py-3 text-xs uppercase space-x-2">
                {postulant.roles?.map((role) => (
                  <span key={role} className="rounded-full bg-white/10 px-2 py-1">
                    {ROLE_LABELS[role] ?? role}
                  </span>
                ))}
              </td>
              <td className="px-4 py-3">
                {enableAssignment ? (
                  <select
                    className="rounded-md border border-white/10 bg-surface px-3 py-2 text-xs uppercase"
                    value={postulant.final_role ?? ''}
                    onChange={(event) =>
                      onAssign?.(postulant.user_id, event.target.value)
                    }
                  >
                    <option value="">Sin asignar</option>
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs uppercase">
                    {ROLE_LABELS[postulant.final_role] ?? postulant.final_role ?? 'Sin asignar'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

PostulantTable.propTypes = {
  postulants: PropTypes.arrayOf(
    PropTypes.shape({
      cta_id: PropTypes.string.isRequired,
      user_id: PropTypes.string.isRequired,
      user_name: PropTypes.string.isRequired,
      roles: PropTypes.arrayOf(PropTypes.string),
      final_role: PropTypes.string
    })
  ).isRequired,
  enableAssignment: PropTypes.bool,
  onAssign: PropTypes.func
};

