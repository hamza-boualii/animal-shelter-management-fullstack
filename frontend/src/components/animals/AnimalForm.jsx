import { useState, useRef, useEffect } from 'react'
import { ESPECES, SEXES, STATUTS_ANIMAL } from '../../utils/constantes'
import { useAuth } from '../../hooks/useAuth'
import { animauxApi } from '../../api/animauxApi'
import AnimalPhoto from './AnimalPhoto'
import Bouton from '../ui/Bouton'

export default function AnimalForm({ animalInitial = null, onEnregistrer, onAnnuler, chargement = false }) {
  const { utilisateur } = useAuth()

  const [form, setForm] = useState(() => ({
    personnelId: animalInitial?.personnelId || utilisateur?.id || 1,
    nom: animalInitial?.nom || '',
    espece: animalInitial?.espece || 'CHIEN',
    race: animalInitial?.race || '',
    sexe: animalInitial?.sexe || 'MALE',
    age: animalInitial?.age ?? 1,
    poids: animalInitial?.poids ?? '',
    description: animalInitial?.description || '',
    photoUrl: animalInitial?.photoUrl || '',
    statut: animalInitial?.statut || 'DISPONIBLE',
    dateArrivee: animalInitial?.dateArrivee || new Date().toISOString().split('T')[0],
  }))

  const [fichierImage, setFichierImage] = useState(null)
  const [apercuImage, setApercuImage] = useState(() => animalInitial?.photoUrl || '')
  const [erreurImage, setErreurImage] = useState('')
  const [enTeleversement, setEnTeleversement] = useState(false)
  const inputFichierRef = useRef(null)

  useEffect(() => {
    return () => {
      if (apercuImage && apercuImage.startsWith('blob:')) {
        URL.revokeObjectURL(apercuImage)
      }
    }
  }, [apercuImage])

  const changer = (e) => {
    const { name, value } = e.target
    setForm((ancien) => ({ ...ancien, [name]: value }))
  }

  const gererSelectionFichier = (e) => {
    const fichier = e.target.files?.[0]
    setErreurImage('')
    if (!fichier) return

    const typesAutorises = ['image/jpeg', 'image/png', 'image/webp']
    const extensionValide = /\.(jpe?g|png|webp)$/i

    if (!typesAutorises.includes(fichier.type) && !extensionValide.test(fichier.name)) {
      setErreurImage('Format non supporté. Veuillez sélectionner une image au format JPG, PNG ou WebP.')
      e.target.value = ''
      return
    }

    const tailleMax = 5 * 1024 * 1024
    if (fichier.size > tailleMax) {
      setErreurImage('Fichier trop volumineux. La taille maximale autorisée est de 5 Mo.')
      e.target.value = ''
      return
    }

    if (apercuImage && apercuImage.startsWith('blob:')) {
      URL.revokeObjectURL(apercuImage)
    }

    setFichierImage(fichier)
    setApercuImage(URL.createObjectURL(fichier))
  }

  const annulerSelectionFichier = () => {
    if (apercuImage && apercuImage.startsWith('blob:')) {
      URL.revokeObjectURL(apercuImage)
    }
    setFichierImage(null)
    setApercuImage(animalInitial?.photoUrl || '')
    setErreurImage('')
    if (inputFichierRef.current) {
      inputFichierRef.current.value = ''
    }
  }

  const gererSoumission = async (e) => {
    e.preventDefault()
    setErreurImage('')

    if (!animalInitial && !fichierImage) {
      setErreurImage('Veuillez sélectionner une photo de l’animal avant d’enregistrer.')
      return
    }

    let urlFinale = form.photoUrl

    if (fichierImage) {
      setEnTeleversement(true)
      try {
        const reponse = await animauxApi.televerserPhoto(
          fichierImage,
          form.personnelId || utilisateur?.id || 1
        )
        urlFinale = reponse.photoUrl || reponse.url || urlFinale
      } catch (err) {
        setErreurImage(err.message || 'Échec du téléversement de la photo.')
        setEnTeleversement(false)
        return
      } finally {
        setEnTeleversement(false)
      }
    }

    if (!urlFinale) {
      setErreurImage('Le téléversement de la photo a échoué. Veuillez réessayer.')
      return
    }

    onEnregistrer({
      ...form,
      photoUrl: urlFinale,
      personnelId: Number(form.personnelId),
      age: Number(form.age),
      poids: form.poids === '' ? null : Number(form.poids),
    })
  }

  const formaterTaille = (octets) => {
    if (!octets) return ''
    if (octets < 1024 * 1024) {
      return `${(octets / 1024).toFixed(0)} Ko`
    }
    return `${(octets / (1024 * 1024)).toFixed(2)} Mo`
  }

  return (
    <form onSubmit={gererSoumission} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
            Nom de l’animal <span className="text-brand-burnt">*</span>
          </label>
          <input
            name="nom"
            type="text"
            required
            value={form.nom}
            onChange={changer}
            placeholder="Ex : Rex"
            className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
            Espèce <span className="text-brand-burnt">*</span>
          </label>
          <select
            name="espece"
            value={form.espece}
            onChange={changer}
            className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
          >
            {Object.entries(ESPECES).map(([code, info]) => (
              <option key={code} value={code}>
                {info.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
            Race
          </label>
          <input
            name="race"
            type="text"
            value={form.race}
            onChange={changer}
            placeholder="Ex : Berger Allemand"
            className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
            Sexe <span className="text-brand-burnt">*</span>
          </label>
          <select
            name="sexe"
            value={form.sexe}
            onChange={changer}
            className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
          >
            {Object.entries(SEXES).map(([code, info]) => (
              <option key={code} value={code}>
                {info.symbole} {info.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
            Âge (années) <span className="text-brand-burnt">*</span>
          </label>
          <input
            name="age"
            type="number"
            min="0"
            max="30"
            required
            value={form.age}
            onChange={changer}
            className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
            Poids (kg)
          </label>
          <input
            name="poids"
            type="number"
            step="0.01"
            min="0.1"
            max="150"
            value={form.poids}
            onChange={changer}
            placeholder="Ex : 12.5"
            className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
            Statut actuel <span className="text-brand-burnt">*</span>
          </label>
          <select
            name="statut"
            value={form.statut}
            onChange={changer}
            className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
          >
            {Object.entries(STATUTS_ANIMAL).map(([code, info]) => (
              <option key={code} value={code}>
                {info.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
            Date d’arrivée <span className="text-brand-burnt">*</span>
          </label>
          <input
            name="dateArrivee"
            type="date"
            required
            value={form.dateArrivee}
            onChange={changer}
            className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
          Photographie de l’animal <span className="text-brand-burnt">*</span>
        </label>
        
        <input
          ref={inputFichierRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={gererSelectionFichier}
          className="hidden"
        />

        <div className="p-4 rounded-2xl border border-brand-stone bg-[#FFF8F5]/60 space-y-3">
          {apercuImage ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-brand-surface border border-brand-stone/80 shrink-0 shadow-sm">
                <AnimalPhoto
                  src={apercuImage}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                {fichierImage ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Nouvelle image sélectionnée
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-brand-dark truncate">{fichierImage.name}</p>
                    <p className="text-[11px] text-brand-taupe">{formaterTaille(fichierImage.size)}</p>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-surface text-brand-burnt border border-brand-burnt/20">
                      Photo actuelle
                    </span>
                    <p className="text-xs text-brand-taupe truncate">{form.photoUrl}</p>
                  </>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => inputFichierRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-brand-surface text-brand-dark border border-brand-stone text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    {fichierImage ? 'Remplacer l’image' : 'Changer la photo'}
                  </button>
                  {fichierImage && (
                    <button
                      type="button"
                      onClick={annulerSelectionFichier}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      Annuler la sélection
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => inputFichierRef.current?.click()}
              className="border-2 border-dashed border-brand-stone hover:border-brand-burnt/60 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-white/70 hover:bg-white flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-surface text-brand-burnt flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-brand-dark">
                  Sélectionner une photo depuis votre ordinateur
                </p>
                <p className="text-[11px] text-brand-taupe mt-0.5">
                  Formats acceptés : JPG, PNG, WebP — Maximum 5 Mo
                </p>
              </div>
            </div>
          )}

          {erreurImage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{erreurImage}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
          Description &amp; Tempérament
        </label>
        <textarea
          name="description"
          rows="3"
          value={form.description}
          onChange={changer}
          placeholder="Comportement, entente avec d'autres animaux, besoins particuliers..."
          className="w-full p-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm placeholder:text-brand-taupe"
        ></textarea>
      </div>

      <div className="sticky bottom-0 -mx-6 flex justify-end gap-3 px-6 pt-3 border-t border-brand-stone bg-white">
        {onAnnuler && (
          <Bouton variant="secondary" onClick={onAnnuler} disabled={chargement || enTeleversement}>
            Annuler
          </Bouton>
        )}
        <Bouton type="submit" variant="primary" chargement={chargement || enTeleversement}>
          {animalInitial ? 'Enregistrer les modifications' : 'Ajouter l’animal au refuge'}
        </Bouton>
      </div>
    </form>
  )
}
