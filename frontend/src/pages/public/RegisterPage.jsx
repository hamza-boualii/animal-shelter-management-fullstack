import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Bouton from '../../components/ui/Bouton'
import Notification from '../../components/ui/Notification'
import MascotCameo from '../../components/ui/MascotCameo'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { inscrire, connecter, chargement, erreur, reinitialiserErreur } = useAuth()

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
  })

  const [confirmation, setConfirmation] = useState(false)

  const changer = (e) => {
    const { name, value } = e.target
    setForm((ancien) => ({ ...ancien, [name]: value }))
  }

  const gererSoumission = async (e) => {
    e.preventDefault()
    try {
      await inscrire(form)
      // Connexion automatique après inscription réussie
      try {
        await connecter(form.email, form.motDePasse)
        navigate('/animaux')
      } catch {
        setConfirmation(true)
      }
    } catch {
      // Erreur capturée par AuthContext
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl sm:rounded-[2.5rem] border border-brand-burnt/15 shadow-warm-lg overflow-hidden">
        {/* Volet éditorial gauche (Stitch Split-Screen) */}
        <div className="lg:col-span-5 bg-brand-dark p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-orange/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-burnt flex items-center justify-center text-white">
                🐾
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight">
                  Rafiq <span className="font-arabic font-normal text-brand-peach text-xl">| رفيق</span>
                </span>
                <p className="text-[11px] text-brand-peach">Rejoindre la communauté des adoptants</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug pt-4">
              Ouvrez votre cœur à un <br />
              <span className="font-serif italic font-normal text-brand-peach">nouveau compagnon</span>.
            </h2>

            <p className="text-xs sm:text-sm text-brand-cream/80 leading-relaxed font-light">
              L’inscription est gratuite, rapide et vous donne accès au dépôt de demandes d’adoption et à la planification de visites au refuge.
            </p>
          </div>

          <div className="relative z-10 pt-8 mt-auto border-t border-white/10">
            <MascotCameo
              mode="bounce"
              taille={54}
              titreBulle="Bienvenue !"
              bulle="Nous avons hâte de vous faire découvrir nos protégés."
            />
          </div>
        </div>

        {/* Volet formulaire droit */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Créer un compte</h3>
              <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
                Compte public d’adoptant responsable
              </p>
            </div>

            {erreur && (
              <Notification
                type="erreur"
                message={erreur}
                onFermer={reinitialiserErreur}
              />
            )}

            {confirmation ? (
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl mx-auto">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-emerald-900">Compte créé avec succès !</h4>
                <p className="text-xs text-emerald-800">
                  Votre compte Adoptant a été enregistré. Vous pouvez maintenant vous connecter.
                </p>
                <div className="pt-2">
                  <Link to="/login">
                    <Bouton variant="primary" size="md">
                      Accéder à la connexion
                    </Bouton>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={gererSoumission} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                      Nom <span className="text-brand-burnt">*</span>
                    </label>
                    <input
                      name="nom"
                      type="text"
                      required
                      value={form.nom}
                      onChange={changer}
                      placeholder="Ben Ali"
                      className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                      Prénom <span className="text-brand-burnt">*</span>
                    </label>
                    <input
                      name="prenom"
                      type="text"
                      required
                      value={form.prenom}
                      onChange={changer}
                      placeholder="Amine"
                      className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                    Adresse Email <span className="text-brand-burnt">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={changer}
                    placeholder="amine.benali@mail.tn"
                    className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                    Numéro de Téléphone
                  </label>
                  <input
                    name="telephone"
                    type="tel"
                    value={form.telephone}
                    onChange={changer}
                    placeholder="98123456"
                    className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                    Mot de passe <span className="text-brand-burnt">*</span>
                  </label>
                  <input
                    name="motDePasse"
                    type="password"
                    required
                    value={form.motDePasse}
                    onChange={changer}
                    placeholder="••••••••"
                    className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
                  />
                </div>

                <Bouton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  chargement={chargement}
                >
                  Créer mon compte
                </Bouton>
              </form>
            )}

            <div className="pt-4 border-t border-brand-stone text-center text-xs text-brand-dark/70">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="font-bold text-brand-burnt hover:underline">
                Connectez-vous
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
