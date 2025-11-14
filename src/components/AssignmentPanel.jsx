import { useState } from 'react';
import PropTypes from 'prop-types';
import PostulantTable from './PostulantTable.jsx';

const API_BASE_URL = import.meta.env.PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

export default function AssignmentPanel({ ctaId, initialPostulants, canAssign }) {
  const [postulants, setPostulants] = useState(initialPostulants);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAssign = async (userId, finalRole) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/cta/asignar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ctaId,
          assignments: [{ userId, finalRole }]
        })
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      setPostulants((current) =>
        current.map((postulant) =>
          postulant.user_id === userId
            ? { ...postulant, final_role: finalRole }
            : postulant
        )
      );
      setMessage({ type: 'success', text: 'Rol actualizado' });
    } catch (error) {
      console.error('[web] Error asignando rol', error);
      setMessage({ type: 'error', text: 'No se pudo actualizar el rol' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`rounded-lg border px-3 py-2 text-sm ${
            message.type === 'success'
              ? 'border-success/40 bg-success/20 text-success'
              : 'border-danger/40 bg-danger/20 text-danger'
          }`}
        >
          {message.text}
        </div>
      )}
      <PostulantTable
        postulants={postulants}
        enableAssignment={canAssign}
        onAssign={handleAssign}
      />
      {loading && <p className="text-xs uppercase tracking-widest text-slate-400">Guardando cambios...</p>}
    </div>
  );
}

AssignmentPanel.propTypes = {
  ctaId: PropTypes.string.isRequired,
  initialPostulants: PropTypes.arrayOf(
    PropTypes.shape({
      cta_id: PropTypes.string.isRequired,
      user_id: PropTypes.string.isRequired,
      user_name: PropTypes.string.isRequired,
      roles: PropTypes.arrayOf(PropTypes.string),
      final_role: PropTypes.string
    })
  ).isRequired,
  canAssign: PropTypes.bool
};

