import { api } from './client'

export const animauxApi = {
  lister: () => api.get('/animaux'),
  obtenir: (id) => api.get(`/animaux/${id}`),
  creer: (animal) => api.post('/animaux', animal),
  modifier: (id, animal) => api.put(`/animaux/${id}`, animal),
  supprimer: (id) => api.delete(`/animaux/${id}`),
}
