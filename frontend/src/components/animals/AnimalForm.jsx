import { useState } from 'react'
import { ESPECES, SEXES, STATUTS_ANIMAL } from '../../utils/constantes'
import { useAuth } from '../../hooks/useAuth'
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

  const changer = (e) => {
    const { name, value } = e.target
    setForm((ancien) => ({ ...ancien, [name]: value }))
  }

  const gererSoumission = (e) => {
    e.preventDefault()
    onEnregistrer({
      ...form,
      personnelId: Number(form.personnelId),
      age: Number(form.age),
      poids: form.poids === '' ? null : Number(form.poids),
    })
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
                {info.icone} {info.label}
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
            Poids (kg) <span className="text-brand-burnt">*</span>
          </label>
          <input
            name="poids"
            type="number"
            min="0.01"
            max="9999.99"
            step="0.01"
            inputMode="decimal"
            required
            value={form.poids}
            onChange={changer}
            placeholder="Ex : 4.20"
            className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
          />
          <p className="text-[11px] text-brand-taupe mt-1">
            En kilogrammes, strictement supérieur à 0 et deux décimales maximum.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
            Statut au refuge <span className="text-brand-burnt">*</span>
          </label>
          <select
            name="statut"
            value={form.statut}
            onChange={changer}
            className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm font-semibold"
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
            Date d’arrivée au refuge <span className="text-brand-burnt">*</span>
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
          URL de la photographie
        </label>
        <input
          name="photoUrl"
          type="text"
          value={form.photoUrl}
          onChange={changer}
          placeholder="/images/animals/golden-retriever.png"
          className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm font-mono"
        />
        <p className="text-[11px] text-brand-taupe mt-1">
          Laissez vide pour utiliser automatiquement la photo par défaut de l’espèce.
        </p>
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

      <div className="flex justify-end gap-3 pt-3 border-t border-brand-stone">
        {onAnnuler && (
          <Bouton variant="secondary" onClick={onAnnuler} disabled={chargement}>
            Annuler
          </Bouton>
        )}
        <Bouton type="submit" variant="primary" chargement={chargement}>
          {animalInitial ? 'Enregistrer les modifications' : 'Ajouter l’animal au refuge'}
        </Bouton>
      </div>
    </form>
  )
}
