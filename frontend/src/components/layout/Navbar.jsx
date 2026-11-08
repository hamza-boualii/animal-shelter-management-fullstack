import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Bouton from '../ui/Bouton'

export default function Navbar() {
  const { utilisateur, estConnecte, estPersonnel, deconnecter } = useAuth()
  const [menuMobileOuvert, setMenuMobileOuvert] = useState(false)
  const navigate = useNavigate()

  const gererDeconnexion = () => {
    deconnecter()
    navigate('/')
  }

  const lienClasses = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? 'text-brand-burnt' : 'text-brand-dark/80 hover:text-brand-burnt'
    }`

  return (
    <>
      {/* 1. Barre supérieure d'informations du sanctuaire */}
      <div className="bg-brand-dark text-brand-cream/90 text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-burnt text-white">
              Refuge &amp; Sanctuaire
            </span>
            <span className="tracking-wide">
              Visite des jardins sensoriels : Tous les jours 10h00 – 18h00
            </span>
          </div>
          <div className="flex items-center space-x-6 text-xs text-brand-peach">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              Ligne d’adoption : +1 (800) 555-RAFIQ
            </span>
            <span className="font-arabic text-sm text-white/90">رفيق رعاية الحيوان</span>
          </div>
        </div>
      </div>

      {/* 2. Barre de navigation principale (flottante avec flou) */}
      <header className="sticky top-0 z-40 bg-brand-cream/95 backdrop-blur-md border-b border-brand-burnt/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Identité visuelle */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-burnt rounded-xl"
            aria-label="Accueil Rafiq Refuge"
          >
            <div className="w-11 h-11 rounded-2xl bg-brand-burnt flex items-center justify-center text-white shadow-warm-sm group-hover:bg-brand-orange transition-colors">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <ellipse cx="8.5" cy="5" rx="1.75" ry="2.5" />
                <ellipse cx="15.5" cy="5" rx="1.75" ry="2.5" />
                <ellipse cx="4.75" cy="9.5" rx="1.6" ry="2.2" />
                <ellipse cx="19.25" cy="9.5" rx="1.6" ry="2.2" />
                <path d="M12 10.2c-3.1 0-5.7 2.1-5.7 4.9 0 2.2 1.6 3.9 3.5 3.9.9 0 1.6-.4 2.2-1 .6.6 1.3 1 2.2 1 1.9 0 3.5-1.7 3.5-3.9 0-2.8-2.6-4.9-5.7-4.9z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-brand-dark flex items-center gap-1.5 leading-tight">
                Rafiq <span className="font-arabic font-normal text-brand-burnt text-xl leading-none">| رفيق</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-brand-burnt">
                Sanctuaire &amp; Adoption
              </span>
            </div>
          </Link>

          {/* Liens de navigation bureau */}
          <nav aria-label="Navigation principale" className="hidden md:flex items-center space-x-7">
            <NavLink to="/" end className={lienClasses}>
              Accueil
            </NavLink>
            <NavLink to="/animaux" className={lienClasses}>
              Explorer les animaux
            </NavLink>
            <a href="/#adoption-process" className="text-sm font-semibold text-brand-dark/80 hover:text-brand-burnt transition-colors">
              Comment ça marche
            </a>

            {/* Liens spécifiques au personnel */}
            {estPersonnel && (
              <NavLink
                to="/personnel"
                className={({ isActive }) =>
                  `text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-brand-burnt text-white shadow-[0_4px_12px_rgba(198,83,53,0.3)]'
                      : 'bg-brand-burnt/10 text-brand-burnt hover:bg-brand-burnt hover:text-white'
                  }`
                }
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span>Espace Personnel</span>
              </NavLink>
            )}
          </nav>

          {/* Actions utilisateur / Authentification */}
          <div className="hidden sm:flex items-center space-x-3">
            {estConnecte ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-brand-dark leading-tight">{utilisateur.nom}</p>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-peach/30 text-brand-burnt">
                    {estPersonnel ? 'Personnel' : 'Adoptant'}
                  </span>
                </div>
                <Bouton variant="secondary" size="sm" onClick={gererDeconnexion}>
                  Déconnexion
                </Bouton>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-brand-dark hover:text-brand-burnt transition-colors px-3 py-2"
                >
                  Connexion
                </Link>
                <Link to="/register">
                  <Bouton variant="primary" size="md">
                    Créer un compte
                  </Bouton>
                </Link>
              </>
            )}
          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMenuMobileOuvert(!menuMobileOuvert)}
              className="p-2 rounded-xl text-brand-dark hover:bg-brand-surface focus:outline-none"
              aria-label="Ouvrir le menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuMobileOuvert ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {menuMobileOuvert && (
          <div className="md:hidden border-t border-brand-burnt/10 bg-brand-cream px-4 pt-3 pb-6 space-y-3">
            <NavLink
              to="/"
              end
              onClick={() => setMenuMobileOuvert(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-brand-dark hover:bg-brand-surface"
            >
              Accueil
            </NavLink>
            <NavLink
              to="/animaux"
              onClick={() => setMenuMobileOuvert(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-brand-dark hover:bg-brand-surface"
            >
              Explorer les animaux
            </NavLink>
            <a
              href="/#adoption-process"
              onClick={() => setMenuMobileOuvert(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-brand-dark hover:bg-brand-surface"
            >
              Comment ça marche
            </a>

            {estPersonnel && (
              <NavLink
                to="/personnel"
                onClick={() => setMenuMobileOuvert(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-bold bg-brand-burnt/10 text-brand-burnt"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span>Espace Personnel</span>
              </NavLink>
            )}

            <div className="pt-4 border-t border-brand-burnt/15 flex flex-col gap-2">
              {estConnecte ? (
                <>
                  <div className="px-3 py-1">
                    <p className="text-sm font-bold text-brand-dark">{utilisateur.nom}</p>
                    <p className="text-xs text-brand-taupe">{utilisateur.email}</p>
                  </div>
                  <Bouton
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      setMenuMobileOuvert(false)
                      gererDeconnexion()
                    }}
                  >
                    Déconnexion
                  </Bouton>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuMobileOuvert(false)}>
                    <Bouton variant="secondary" size="md" className="w-full">
                      Connexion
                    </Bouton>
                  </Link>
                  <Link to="/register" onClick={() => setMenuMobileOuvert(false)}>
                    <Bouton variant="primary" size="md" className="w-full">
                      Créer un compte
                    </Bouton>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
