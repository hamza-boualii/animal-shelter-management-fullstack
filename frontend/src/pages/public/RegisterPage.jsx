import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AuthField from '../../components/auth/AuthField'
import AuthIcon from '../../components/auth/AuthIcon'
import AuthPasswordField from '../../components/auth/AuthPasswordField'
import AuthShell from '../../components/auth/AuthShell'
import AuthSubmitButton from '../../components/auth/AuthSubmitButton'
import Notification from '../../components/ui/Notification'

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
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('')
  const [erreurConfirmation, setErreurConfirmation] = useState('')
  const [compteCree, setCompteCree] = useState(false)

  const changer = (e) => {
    const { name, value } = e.target
    setForm((ancien) => ({ ...ancien, [name]: value }))
    if (name === 'motDePasse') {
      setErreurConfirmation('')
    }
  }

  const changerConfirmation = (e) => {
    setConfirmationMotDePasse(e.target.value)
    setErreurConfirmation('')
  }

  const gererSoumission = async (e) => {
    e.preventDefault()

    if (form.motDePasse !== confirmationMotDePasse) {
      setErreurConfirmation('Les mots de passe ne correspondent pas.')
      return
    }

    try {
      await inscrire(form)
      try {
        await connecter(form.email, form.motDePasse)
        navigate('/animaux')
      } catch {
        setCompteCree(true)
      }
    } catch {
      // Erreur capturée par AuthContext
    }
  }

  return (
    <AuthShell
      variant="dog"
      title="Créer votre compte"
      description="Rejoignez le réseau éthique du sanctuaire et commencez vos démarches."
      footnote={
        <div className="mt-6 flex items-center justify-center gap-2 text-brand-taupe">
          <span className="h-1.5 w-1.5 rounded-full bg-[#9E4211]" />
          <span className="text-[11px] font-semibold">
            Données protégées · Engagement de bientraitance animale
          </span>
        </div>
      }
      footer={
        <div className="mt-4 border-t border-brand-stone/60 pt-4 text-center">
          <p className="text-[13px] text-brand-taupe">
            Vous avez déjà un compte ?{' '}
            <Link
              to="/login"
              className="ml-1 inline-flex items-center gap-0.5 font-semibold text-brand-burnt transition-colors hover:text-brand-orange"
            >
              <span>Se connecter</span>
              <AuthIcon name="log-in" className="h-[15px] w-[15px]" />
            </Link>
          </p>
        </div>
      }
    >
      {erreur && (
        <div className="mb-4">
          <Notification type="erreur" message={erreur} onFermer={reinitialiserErreur} />
        </div>
      )}

      {compteCree ? (
        <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
            ✓
          </div>
          <h2 className="text-lg font-bold text-emerald-900">Compte créé avec succès !</h2>
          <p className="text-[13px] text-emerald-800">
            Votre compte Adoptant a été enregistré. Vous pouvez maintenant vous connecter.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-burnt px-5 text-sm font-semibold text-white transition-colors hover:bg-[#B44629]"
            >
              Accéder à la connexion
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={gererSoumission} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthField
              id="nom"
              label="Nom"
              labelAlt="Last name"
              icon="id-card"
              value={form.nom}
              onChange={changer}
              placeholder="Ben Ali"
              autoComplete="family-name"
              required
            />
            <AuthField
              id="prenom"
              label="Prénom"
              labelAlt="First name"
              icon="user"
              value={form.prenom}
              onChange={changer}
              placeholder="Amine"
              autoComplete="given-name"
              required
            />
          </div>

          <AuthField
            id="email"
            label="Adresse e-mail"
            labelAlt="Email address"
            icon="mail"
            type="email"
            value={form.email}
            onChange={changer}
            placeholder="coordination@rafiq-shelter.org"
            autoComplete="email"
            required
          />

          <AuthField
            id="telephone"
            label="Numéro de téléphone"
            labelAlt="Phone"
            icon="phone"
            type="tel"
            value={form.telephone}
            onChange={changer}
            placeholder="98123456"
            autoComplete="tel"
          />

          <AuthPasswordField
            id="motDePasse"
            label="Mot de passe"
            labelAlt="Password"
            value={form.motDePasse}
            onChange={changer}
            autoComplete="new-password"
          />

          <AuthPasswordField
            id="confirmationMotDePasse"
            label="Confirmer le mot de passe"
            labelAlt="Confirm"
            value={confirmationMotDePasse}
            onChange={changerConfirmation}
            autoComplete="new-password"
            error={erreurConfirmation}
          />

          <div className="pt-1">
            <AuthSubmitButton chargement={chargement}>Créer mon compte Rafiq</AuthSubmitButton>
          </div>
        </form>
      )}
    </AuthShell>
  )
}
