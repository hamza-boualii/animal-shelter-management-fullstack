import { useState, useEffect, useCallback } from 'react'
import { demandesApi } from '../api/demandesApi'

export function useDemandes() {
  const [demandes, setDemandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  const recharger = useCallback(async () => {
    try {
      setChargement(true)
      setErreur(null)
      const donnees = await demandesApi.lister()
      setDemandes(Array.isArray(donnees) ? donnees : [])
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
        const donnees = await demandesApi.lister()
        if (!annule) setDemandes(Array.isArray(donnees) ? donnees : [])
      } catch (err) {
        if (!annule) setErreur(err.message)
      } finally {
        if (!annule) setChargement(false)
      }
    }
    chargerDonnees()
    return () => { annule = true }
  }, [])

  const creerDemande = async (payload) => {
    const nouvelle = await demandesApi.creer(payload)
    await recharger()
    return nouvelle
  }

  const modifierStatut = async (id, statut) => {
    const maj = await demandesApi.modifierStatut(id, statut)
    await recharger()
    return maj
  }

  return {
    demandes,
    chargement,
    erreur,
    recharger,
    creerDemande,
    modifierStatut,
  }
}
