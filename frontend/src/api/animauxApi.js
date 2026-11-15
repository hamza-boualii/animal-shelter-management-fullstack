import { api } from './client'

export const animauxApi = {
  lister: () => api.get('/animaux'),
  obtenir: (id) => api.get(`/animaux/${id}`),
  creer: (animal) => api.post('/animaux', animal),
  modifier: (id, animal) => api.put(`/animaux/${id}`, animal),
  supprimer: (id) => api.delete(`/animaux/${id}`),
  televerserPhoto: (fichier, personnelId) => {
    const formData = new FormData()
    formData.append('image', fichier)
    return api.upload('/animaux/upload', formData, {
      headers: {
        'X-Personnel-Id': String(personnelId || 1),
        'X-User-Role': 'PERSONNEL',
      },
    })
  },
}
