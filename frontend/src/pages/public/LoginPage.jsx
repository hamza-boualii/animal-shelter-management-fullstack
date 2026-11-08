import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../utils/constantes'
import Bouton from '../../components/ui/Bouton'
import Notification from '../../components/ui/Notification'
import MascotCameo from '../../components/ui/MascotCameo'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { utilisateur, connecter, chargement, erreur, reinitialiserErreur } = useAuth()

  const estRedirectionPersonnel = Boolean(
    location.state?.redirection?.startsWith('/personnel')
  )

  // Type de compte : 'PERSONNEL' si redirection vers /personnel, sinon 'ADOPTANT' (défaut)
  const [typeCompte, setTypeCompte] = useState(() =>
    estRedirectionPersonnel ? ROLES.PERSONNEL : ROLES.ADOPTANT
  )
  const [identifiant, setIdentifiant] = useState('')
  const [motDePasse, setMotDePasse] = useState('')

  const redirection =
    typeCompte === ROLES.PERSONNEL
      ? location.state?.redirection || '/personnel'
      : location.state?.redirection && !location.state.redirection.startsWith('/personnel')
        ? location.state.redirection
        : '/animaux'

  const changerTypeCompte = (nouveauType) => {
    setTypeCompte(nouveauType)
    setIdentifiant('')
    setMotDePasse('')
    reinitialiserErreur()
  }

  const gererSoumission = async (e) => {
    e.preventDefault()
    try {
      await connecter(identifiant, motDePasse, typeCompte)
      navigate(redirection, { replace: true })
    } catch {
      // Erreur capturée par AuthContext
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl sm:rounded-[2.5rem] border border-brand-burnt/15 shadow-warm-lg overflow-hidden">
        {/* Volet éditorial gauche (Stitch Split-Screen Showcase) */}
        <div className="lg:col-span-5 bg-brand-dark p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-burnt/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-burnt flex items-center justify-center text-white">
                🐾
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight">
                  Rafiq <span className="font-arabic font-normal text-brand-peach text-xl">| رفيق</span>
                </span>
                <p className="text-[11px] text-brand-peach">Portail de connexion sécurisé</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug pt-4">
              Chaque rencontre commence par un <br />
              <span className="font-serif italic font-normal text-brand-peach">engagement</span> de cœur.
            </h2>

            <p className="text-xs sm:text-sm text-brand-cream/80 leading-relaxed font-light">
              Connectez-vous pour suivre vos demandes d’adoption ou administrer les soins quotidiens de nos résidents.
            </p>
          </div>

          <div className="relative z-10 pt-8 mt-auto border-t border-white/10">
            <MascotCameo
              mode="peek"
              taille={54}
              titreBulle="Besoin d'aide ?"
              bulle="Les identifiants adoptants utilisent votre adresse email."
            />
          </div>
        </div>

        {/* Volet formulaire droit */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Connexion</h3>
              <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
                Choisissez votre espace d'accès
              </p>
            </div>

            {/* Sélecteur de type de compte : Adoptant vs Personnel */}
            <div className="grid grid-cols-2 p-1.5 bg-brand-surface rounded-2xl border border-brand-burnt/15">
              <button
                type="button"
                onClick={() => changerTypeCompte(ROLES.ADOPTANT)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  typeCompte === ROLES.ADOPTANT
                    ? 'bg-white text-brand-burnt shadow-sm'
                    : 'text-brand-dark/70 hover:text-brand-burnt'
                }`}
              >
                Espace Adoptant
              </button>
              <button
                type="button"
                onClick={() => changerTypeCompte(ROLES.PERSONNEL)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  typeCompte === ROLES.PERSONNEL
                    ? 'bg-brand-burnt text-white shadow-sm'
                    : 'text-brand-dark/70 hover:text-brand-burnt'
                }`}
              >
                Espace Personnel
              </button>
            </div>

            {erreur && (
              <Notification
                type="erreur"
                message={erreur}
                onFermer={reinitialiserErreur}
              />
            )}

            <form onSubmit={gererSoumission} className="space-y-4">
              {utilisateur?.role === ROLES.ADOPTANT && typeCompte === ROLES.PERSONNEL && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <p className="font-semibold">Session adoptant active ({utilisateur.nom})</p>
                  <p className="mt-0.5">
                    Connectez-vous ci-dessous pour basculer vers votre compte du personnel du refuge.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
                  {typeCompte === ROLES.PERSONNEL ? 'Nom d’utilisateur ou Email' : 'Adresse Email'}
                </label>
                <input
                  type={typeCompte === ROLES.PERSONNEL ? 'text' : 'email'}
                  required
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  placeholder={
                    typeCompte === ROLES.PERSONNEL ? 'Ex : admin ou admin@shelter.tn' : 'votre.email@exemple.com'
                  }
                  className="w-full h-12 px-4 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-xl border border-brand-stone bg-white focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm"
                />
              </div>

              {typeCompte === ROLES.PERSONNEL && (
                <div className="p-3 bg-brand-cream/80 rounded-xl border border-brand-burnt/15 text-xs text-brand-dark/80">
                  <p className="font-semibold text-brand-burnt">Note d'accès interne :</p>
                  <p className="mt-0.5">
                    Les comptes membres de l’équipe de refuge sont provisionnés en interne. Utilisez votre nom d'utilisateur ou email (ex : <code>admin</code> ou <code>admin@shelter.tn</code> / <code>personnel123</code>).
                  </p>
                </div>
              )}

              <Bouton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                chargement={chargement}
              >
                Se connecter
              </Bouton>
            </form>

            {typeCompte === ROLES.ADOPTANT && (
              <div className="pt-4 border-t border-brand-stone text-center text-xs text-brand-dark/70">
                Vous n’avez pas encore de compte ?{' '}
                <Link to="/register" className="font-bold text-brand-burnt hover:underline">
                  Inscrivez-vous comme adoptant
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
