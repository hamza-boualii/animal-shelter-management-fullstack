/**
 * Client HTTP central de l'application (unique porte vers le backend).
 * Conforme à la section 5.4 du guide du professeur.
 */

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

async function requete(path, options = {}) {
  const { headers, ...reste } = options

  const reponse = await fetch(`${API_URL}${path}`, {
    ...reste,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  // Un DELETE réussi ou réponse vide renvoie 204 : pas de corps à lire
  if (reponse.status === 204) {
    return null
  }

  const texte = await reponse.text()
  let donnees = null
  if (texte) {
    try {
      donnees = JSON.parse(texte)
    } catch {
      donnees = null
    }
  }

  if (!reponse.ok) {
    const message = donnees?.erreur ?? texte ?? `Erreur HTTP ${reponse.status}`
    throw new Error(message)
  }

  return donnees
}

export const api = {
  get: (path, options) => requete(path, { ...options, method: 'GET' }),
  post: (path, body, options) =>
    requete(path, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: (path, body, options) =>
    requete(path, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: (path, options) => requete(path, { ...options, method: 'DELETE' }),
}
