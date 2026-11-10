import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../utils/constantes'
import AuthField from '../../components/auth/AuthField'
import AuthIcon from '../../components/auth/AuthIcon'
import AuthPasswordField from '../../components/auth/AuthPasswordField'
import AuthShell from '../../components/auth/AuthShell'
import AuthSubmitButton from '../../components/auth/AuthSubmitButton'
import Notification from '../../components/ui/Notification'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { connecter, chargement, erreur, reinitialiserErreur } = useAuth()

  const [identifiant, setIdentifiant] = useState('')
  const [motDePasse, setMotDePasse] = useState('')

  const gererSoumission = async (e) => {
    e.preventDefault()
    try {
      const utilisateurConnecte = await connecter(identifiant, motDePasse)
      const redirectionDemandee = location.state?.redirection

      const destination =
        utilisateurConnecte.role === ROLES.PERSONNEL
          ? redirectionDemandee?.startsWith('/personnel')
            ? redirectionDemandee
            : '/personnel'
          : redirectionDemandee && !redirectionDemandee.startsWith('/personnel')
            ? redirectionDemandee
            : '/animaux'

      navigate(destination, { replace: true })
    } catch {
      // Erreur capturée par AuthContext
    }
  }

  return (
    <AuthShell
      variant="cat"
      title="Bon retour parmi nous"
      description="Accédez à votre espace refuge ou suivez vos parcours d'adoption en cours."
      footer={
        <div className="-mx-6 -mb-6 mt-6 rounded-b-[24px] bg-[#FDF1EC]/70 p-4 text-center sm:-mx-8 sm:-mb-8">
          <p className="text-[13px] text-brand-taupe">
            Vous n'avez pas encore de compte ?{' '}
            <Link
              to="/register"
              className="ml-1 inline-flex items-center gap-1 font-semibold text-brand-burnt transition-colors hover:text-brand-orange"
            >
              <span>Créer un compte</span>
              <AuthIcon name="external-link" className="h-[15px] w-[15px]" />
            </Link>
          </p>
        </div>
      }
      trust={
        <div className="mt-4 flex items-center justify-center gap-2 text-brand-taupe/80">
          <AuthIcon name="shield-check" className="h-4 w-4 text-brand-burnt" />
          <span className="text-[11px] font-semibold">
            Espace sécurisé • Protection des données bénévoles &amp; refuges
          </span>
        </div>
      }
    >
      {erreur && (
        <div className="mb-4">
          <Notification type="erreur" message={erreur} onFermer={reinitialiserErreur} />
        </div>
      )}

      <form onSubmit={gererSoumission} className="space-y-4">
        <AuthField
          id="identity-input"
          label="Nom d'utilisateur ou e-mail"
          icon="at-sign"
          type="text"
          value={identifiant}
          onChange={(e) => setIdentifiant(e.target.value)}
          placeholder="Votre nom d'utilisateur ou e-mail"
          autoComplete="username"
          required
        />

        <AuthPasswordField
          id="password-input"
          label="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          placeholder="••••••••••••"
        />

        <div className="flex items-center justify-end pt-1">
          <a
            href="#forgot"
            onClick={(e) => e.preventDefault()}
            className="text-[13px] font-semibold text-brand-burnt transition-colors hover:text-brand-orange"
          >
            Mot de passe oublié ?
          </a>
        </div>

        <div className="pt-2">
          <AuthSubmitButton chargement={chargement}>Se connecter à mon compte</AuthSubmitButton>
        </div>
      </form>
    </AuthShell>
  )
}
