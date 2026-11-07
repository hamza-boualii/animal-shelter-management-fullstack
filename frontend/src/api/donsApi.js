import { api } from './client'

export const donsApi = {
  lister: () => api.get('/dons'),
  obtenir: (id) => api.get(`/dons/${id}`),
  creer: (don) => api.post('/dons', don),
  modifier: (id, don) => api.put(`/dons/${id}`, don),
  supprimer: (id) => api.delete(`/dons/${id}`),
}
