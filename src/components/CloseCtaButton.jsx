import { useState } from 'react';
import PropTypes from 'prop-types';

const API_BASE_URL = import.meta.env.PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

export default function CloseCtaButton({ ctaId, disabled }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/cta/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ctaId })
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      setMessage({ type: 'success', text: 'CTA cerrada correctamente' });
    } catch (error) {
      console.error('[web] Error cerrando CTA', error);
      setMessage({ type: 'error', text: 'No se pudo cerrar la CTA' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        className="inline-flex items-center rounded-md border border-danger/40 bg-danger/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-danger hover:bg-danger/30 disabled:cursor-not-allowed disabled:opacity-50 transition"
      >
        {loading ? 'Cerrando...' : 'Cerrar CTA'}
      </button>
      {message && (
        <p
          className={`text-xs uppercase tracking-widest ${
            message.type === 'success' ? 'text-success' : 'text-danger'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

CloseCtaButton.propTypes = {
  ctaId: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

