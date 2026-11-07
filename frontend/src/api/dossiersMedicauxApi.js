import { api } from './client'

export const dossiersMedicauxApi = {
  lister: () => api.get('/dossiers-medicaux'),
  obtenir: (id) => api.get(`/dossiers-medicaux/${id}`),
  creer: (dossier) => api.post('/dossiers-medicaux', dossier),
  modifier: (id, dossier) => api.put(`/dossiers-medicaux/${id}`, dossier),
  supprimer: (id) => api.delete(`/dossiers-medicaux/${id}`),
}
