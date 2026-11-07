import { useState, useEffect, useCallback } from 'react'
import { donsApi } from '../api/donsApi'

export function useDons() {
  const [dons, setDons] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  const recharger = useCallback(async () => {
    try {
      setChargement(true)
      setErreur(null)
      const donnees = await donsApi.lister()
      setDons(Array.isArray(donnees) ? donnees : [])
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
        const donnees = await donsApi.lister()
        if (!annule) setDons(Array.isArray(donnees) ? donnees : [])
      } catch (err) {
        if (!annule) setErreur(err.message)
      } finally {
        if (!annule) setChargement(false)
      }
    }
    chargerDonnees()
    return () => { annule = true }
  }, [])

  const creerDon = async (payload) => {
    const nouveau = await donsApi.creer(payload)
    await recharger()
    return nouveau
  }

  const modifierDon = async (id, payload) => {
    const maj = await donsApi.modifier(id, payload)
    await recharger()
    return maj
  }

  const supprimerDon = async (id) => {
    await donsApi.supprimer(id)
    await recharger()
  }

  return {
    dons,
    chargement,
    erreur,
    recharger,
    creerDon,
    modifierDon,
    supprimerDon,
  }
}
