/**
 * Utilitaires de formatage de dates conformes au guide du professeur.
 */
export function formaterDate(valeur, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  if (!valeur) return '-'

  // "2026-06-01 09:00:00" n'est pas un ISO valide pour tous les navigateurs.
  const chaine = String(valeur)
  const normalise = chaine.includes('T') ? chaine : chaine.replace(' ', 'T')
  const date = new Date(normalise)

  if (Number.isNaN(date.getTime())) {
    return valeur
  }

  return date.toLocaleDateString('fr-FR', options)
}

export function formaterDateCourte(valeur) {
  return formaterDate(valeur, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formaterDateHeure(valeur) {
  return formaterDate(valeur, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
