import { useState, useEffect, useCallback } from 'react'
import { dossiersMedicauxApi } from '../api/dossiersMedicauxApi'

export function useDossiersMedicaux() {
  const [dossiers, setDossiers] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  const recharger = useCallback(async () => {
    try {
      setChargement(true)
      setErreur(null)
      const donnees = await dossiersMedicauxApi.lister()
      setDossiers(Array.isArray(donnees) ? donnees : [])
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
        const donnees = await dossiersMedicauxApi.lister()
        if (!annule) setDossiers(Array.isArray(donnees) ? donnees : [])
      } catch (err) {
        if (!annule) setErreur(err.message)
      } finally {
        if (!annule) setChargement(false)
      }
    }
    chargerDonnees()
    return () => { annule = true }
  }, [])

  const creerDossier = async (payload) => {
    const nouveau = await dossiersMedicauxApi.creer(payload)
    await recharger()
    return nouveau
  }

  const modifierDossier = async (id, payload) => {
    const maj = await dossiersMedicauxApi.modifier(id, payload)
    await recharger()
    return maj
  }

  const supprimerDossier = async (id) => {
    await dossiersMedicauxApi.supprimer(id)
    await recharger()
  }

  return {
    dossiers,
    chargement,
    erreur,
    recharger,
    creerDossier,
    modifierDossier,
    supprimerDossier,
  }
}
