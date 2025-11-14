import { useState, useEffect } from 'react';
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

export default function PostulateButton({ ctaId, userId, userName, postulants, onUpdate }) {
  const [isPostulated, setIsPostulated] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (userId && postulants) {
      const postulant = postulants.find((p) => p.user_id === userId);
      setIsPostulated(!!postulant);
      if (postulant) {
        setSelectedRoles(postulant.roles || []);
      }
    }
  }, [userId, postulants]);

  const handleToggleModal = () => {
    setShowModal(!showModal);
    setMessage(null);
  };

  const handleRoleToggle = (roleValue) => {
    setSelectedRoles((prev) => {
      if (prev.includes(roleValue)) {
        return prev.filter((r) => r !== roleValue);
      } else if (prev.length < 3) {
        return [...prev, roleValue];
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (selectedRoles.length === 0) {
      setMessage({ type: 'error', text: 'Debes seleccionar al menos un rol' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/cta/postular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ctaId,
          userId,
          userName,
          roles: selectedRoles
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      setMessage({ type: 'success', text: '¡Postulación enviada exitosamente!' });
      setIsPostulated(true);
      onUpdate?.();

      setTimeout(() => {
        setShowModal(false);
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('[web] Error postulándose', error);
      setMessage({ type: 'error', text: error.message || 'No se pudo enviar la postulación' });
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('¿Estás seguro de que quieres retirarte de esta CTA?')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/postulants/leave`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ctaId, userId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      setMessage({ type: 'success', text: 'Te has retirado de la CTA' });
      setIsPostulated(false);
      setSelectedRoles([]);
      onUpdate?.();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('[web] Error retirándose', error);
      setMessage({ type: 'error', text: error.message || 'No se pudo procesar tu solicitud' });
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <a
        href="/api/auth/login"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/30 transition"
      >
        Inicia sesión para postularte
      </a>
    );
  }

  return (
    <>
      <div className="flex gap-3">
        {isPostulated ? (
          <>
            <button
              onClick={handleToggleModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/30 transition"
            >
              Editar postulación
            </button>
            <button
              onClick={handleLeave}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-danger/40 bg-danger/20 px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : 'Retirarse'}
            </button>
          </>
        ) : (
          <button
            onClick={handleToggleModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/30 transition"
          >
            Postularse
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-surface p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-white">
              {isPostulated ? 'Editar postulación' : 'Postularse a la CTA'}
            </h3>

            {message && (
              <div
                className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
                  message.type === 'success'
                    ? 'border-success/40 bg-success/20 text-success'
                    : 'border-danger/40 bg-danger/20 text-danger'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="mb-4 space-y-2">
              <p className="text-sm text-slate-300">Selecciona hasta 3 roles:</p>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_ROLES.map((role) => (
                  <label
                    key={role.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition ${
                      selectedRoles.includes(role.value)
                        ? 'border-primary/40 bg-primary/20 text-primary'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.value)}
                      onChange={() => handleRoleToggle(role.value)}
                      disabled={!selectedRoles.includes(role.value) && selectedRoles.length >= 3}
                      className="rounded border-white/10 text-primary focus:ring-primary/20"
                    />
                    <span className="text-sm font-medium">{role.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleToggleModal}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || selectedRoles.length === 0}
                className="flex-1 rounded-lg border border-primary/40 bg-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : isPostulated ? 'Actualizar' : 'Postularse'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

PostulateButton.propTypes = {
  ctaId: PropTypes.string.isRequired,
  userId: PropTypes.string,
  userName: PropTypes.string,
  postulants: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.string.isRequired,
      roles: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  onUpdate: PropTypes.func
};

