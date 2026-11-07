import { useState, useEffect, useCallback } from 'react'
import { animauxApi } from '../api/animauxApi'

export function useAnimaux(filtres = {}) {
  const [animaux, setAnimaux] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  const recharger = useCallback(async () => {
    try {
      setChargement(true)
      setErreur(null)
      const donnees = await animauxApi.lister()
      setAnimaux(Array.isArray(donnees) ? donnees : [])
    } catch (err) {
      setErreur(err.message)
    } finally {
      setChargement(false)
    }
  }, [])

  useEffect(() => {
    let annule = false
    async function chargerDonnees() {
      try {
        setChargement(true)
        setErreur(null)
        const donnees = await animauxApi.lister()
        if (!annule) setAnimaux(Array.isArray(donnees) ? donnees : [])
      } catch (err) {
        if (!annule) setErreur(err.message)
      } finally {
        if (!annule) setChargement(false)
      }
    }
    chargerDonnees()
    return () => { annule = true }
  }, [])

  const creerAnimal = async (payload) => {
    const nouveau = await animauxApi.creer(payload)
    await recharger()
    return nouveau
  }

  const modifierAnimal = async (id, payload) => {
    const maj = await animauxApi.modifier(id, payload)
    await recharger()
    return maj
  }

  const supprimerAnimal = async (id) => {
    await animauxApi.supprimer(id)
    await recharger()
  }

  // Filtrage côté client si des filtres sont passés
  const animauxFiltres = animaux.filter((animal) => {
    if (filtres.espece && filtres.espece !== 'TOUS' && animal.espece !== filtres.espece) {
      return false
    }
    if (filtres.statut && filtres.statut !== 'TOUS' && animal.statut !== filtres.statut) {
      return false
    }
    if (filtres.recherche) {
      const q = filtres.recherche.toLowerCase().trim()
      const nom = animal.nom?.toLowerCase() || ''
      const race = animal.race?.toLowerCase() || ''
      const description = animal.description?.toLowerCase() || ''
      if (!nom.includes(q) && !race.includes(q) && !description.includes(q)) {
        return false
      }
    }
    return true
  })

  return {
    animaux: animauxFiltres,
    tousLesAnimaux: animaux,
    chargement,
    erreur,
    recharger,
    creerAnimal,
    modifierAnimal,
    supprimerAnimal,
  }
}
