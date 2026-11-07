import { api } from './client'

export const authApi = {
  connecterAdoptant: (identifiant, motDePasse) =>
    api.post('/auth/adoptants/login', { identifiant, motDePasse }),

  connecterPersonnel: (identifiant, motDePasse) =>
    api.post('/auth/personnels/login', { identifiant, motDePasse }),

  inscrireAdoptant: (donnees) =>
    api.post('/adoptants', donnees),
}
