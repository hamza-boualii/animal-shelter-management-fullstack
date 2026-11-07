/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/authApi'
import { ROLES } from '../utils/constantes'

export const AuthContext = createContext(null)

const STORAGE_KEY = 'rafiq_session'

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(() => {
    try {
      const sauvegarde = localStorage.getItem(STORAGE_KEY)
      return sauvegarde ? JSON.parse(sauvegarde) : null
    } catch {
      return null
    }
  })
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    if (utilisateur) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(utilisateur))
      } catch {
        // Ignorer les erreurs de quota localStorage
      }
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [utilisateur])

  const connecter = useCallback(async (identifiant, motDePasse, typeCompte = ROLES.ADOPTANT) => {
    setChargement(true)
    setErreur(null)
    try {
      let reponse
      if (typeCompte === ROLES.PERSONNEL) {
        reponse = await authApi.connecterPersonnel(identifiant, motDePasse)
      } else {
        reponse = await authApi.connecterAdoptant(identifiant, motDePasse)
      }

      setUtilisateur(reponse)
      return reponse
    } catch (err) {
      setErreur(err.message)
      throw err
    } finally {
      setChargement(false)
    }
  }, [])

  const inscrire = useCallback(async (donnees) => {
    setChargement(true)
    setErreur(null)
    try {
      const reponse = await authApi.inscrireAdoptant(donnees)
      return reponse
    } catch (err) {
      setErreur(err.message)
      throw err
    } finally {
      setChargement(false)
    }
  }, [])

  const deconnecter = useCallback(() => {
    setUtilisateur(null)
    setErreur(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const valeur = {
    utilisateur,
    estConnecte: Boolean(utilisateur),
    estPersonnel: utilisateur?.role === ROLES.PERSONNEL,
    estAdoptant: utilisateur?.role === ROLES.ADOPTANT,
    chargement,
    erreur,
    connecter,
    inscrire,
    deconnecter,
    reinitialiserErreur: () => setErreur(null),
  }

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>
}
