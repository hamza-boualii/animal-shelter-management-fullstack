import { api } from './client'

export const demandesApi = {
  lister: () => api.get('/demandes'),
  obtenir: (id) => api.get(`/demandes/${id}`),
  creer: (demande) => api.post('/demandes', demande),
  modifierStatut: (id, statut) => api.put(`/demandes/${id}`, { statut }),
}
