const API_BASE_URL = import.meta.env.PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API error ${response.status}`);
  }

  return response.json();
}

export const api = {
  listCtas: async () => {
    const result = await request('/cta/list');
    return result.data ?? [];
  },
  getCtaDetails: async (ctaId) => {
    const [ctaList, postulantsResult] = await Promise.all([
      request('/cta/list'),
      request(`/cta/${ctaId}/postulants`)
    ]);

    const cta = (ctaList.data ?? []).find((item) => item.id === ctaId) ?? null;
    const postulants = postulantsResult.data ?? [];

    return { cta, postulants };
  },
  assignRoles: (payload) =>
    request('/cta/asignar', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  closeCta: (ctaId) =>
    request('/cta/close', {
      method: 'POST',
      body: JSON.stringify({ ctaId })
    })
};

