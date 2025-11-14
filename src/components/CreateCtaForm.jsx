import { useState } from 'react';
import PropTypes from 'prop-types';

const API_BASE_URL = import.meta.env.PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

const AVAILABLE_ROLES = [
  { value: 'tank', label: 'Tank' },
  { value: 'healer', label: 'Healer' },
  { value: 'dps_melee', label: 'DPS Melee' },
  { value: 'dps_ranged', label: 'DPS Ranged' },
  { value: 'support', label: 'Support' },
  { value: 'scout', label: 'Scout' }
];

export default function CreateCtaForm({ user }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    compo: {}
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [compoForm, setCompoForm] = useState(
    AVAILABLE_ROLES.reduce((acc, role) => {
      acc[role.value] = '';
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompoChange = (role, value) => {
    setCompoForm((prev) => {
      const newCompo = { ...prev, [role]: value };
      const compo = {};
      Object.entries(newCompo).forEach(([key, val]) => {
        if (val && !isNaN(val) && parseInt(val) > 0) {
          compo[key] = parseInt(val);
        }
      });
      setFormData((prev) => ({ ...prev, compo }));
      return newCompo;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!formData.title || !formData.date) {
        throw new Error('Título y fecha son requeridos');
      }

      const payload = {
        title: formData.title,
        description: formData.description || '',
        date: new Date(formData.date).toISOString(),
        compo: formData.compo || {},
        createdBy: user.name || user.username || user.id,
        guildId: null
      };

      const response = await fetch(`${API_BASE_URL}/cta/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      const { data } = await response.json();
      setMessage({ type: 'success', text: `CTA creada exitosamente! ID: ${data.id}` });
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = `/ctas/${data.id}`;
      }, 2000);
    } catch (error) {
      console.error('[web] Error creando CTA', error);
      setMessage({ type: 'error', text: error.message || 'No se pudo crear la CTA' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-white/5 bg-surface/60 p-6 shadow-lg shadow-primary/5">
      {message && (
        <div
          className={`rounded-lg border px-4 py-3 ${
            message.type === 'success'
              ? 'border-success/40 bg-success/20 text-success'
              : 'border-danger/40 bg-danger/20 text-danger'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
            Título <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Ej: CTA Castle Outpost"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Descripción breve de la CTA..."
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-white mb-2">
            Fecha y hora <span className="text-danger">*</span>
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Composición objetivo (opcional)
          </label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {AVAILABLE_ROLES.map((role) => (
              <div key={role.value}>
                <label htmlFor={`compo-${role.value}`} className="block text-xs text-slate-400 mb-1">
                  {role.label}
                </label>
                <input
                  type="number"
                  id={`compo-${role.value}`}
                  min="0"
                  value={compoForm[role.value] || ''}
                  onChange={(e) => handleCompoChange(role.value, e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-slate-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <a
          href="/ctas"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando...' : 'Crear CTA'}
        </button>
      </div>
    </form>
  );
}

CreateCtaForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    username: PropTypes.string
  }).isRequired
};

