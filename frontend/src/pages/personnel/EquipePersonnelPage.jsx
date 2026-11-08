import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { useAuth } from '../../hooks/useAuth'

export default function EquipePersonnelPage() {
  const { utilisateur } = useAuth()
  const contentRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    try {
      const items = contentRef.current ? Array.from(contentRef.current.children) : []
      if (items.length > 0) {
        animate(items, {
          opacity: [0, 1],
          translateY: [14, 0],
          duration: 350,
          ease: 'outCubic',
          delay: stagger(60),
        })
      }
    } catch {
      // Fallback
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* EN-TÊTE OPÉRATIONNEL */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
          Équipe &amp; Sécurité du Sanctuaire
        </h1>
        <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
          Architecture des comptes collaborateurs, gouvernance des accès et politique de sécurité du refuge
        </p>
      </div>

      <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Volet profil du soignant connecté */}
        <div className="lg:col-span-5 bg-white p-7 sm:p-8 rounded-3xl border border-brand-burnt/15 shadow-[0_8px_30px_rgba(52,46,43,0.04)] space-y-6">
          <div className="flex items-center gap-4 border-b border-brand-stone/50 pb-5">
            <div className="w-14 h-14 rounded-2xl bg-brand-burnt flex items-center justify-center text-white shadow-warm-sm shrink-0">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-brand-dark">{utilisateur?.nom || 'Collaborateur'}</h2>
              <p className="text-xs text-brand-dark/70">{utilisateur?.email || 'staff@shelter.tn'}</p>
              <span className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Session Personnel Active</span>
              </span>
            </div>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm text-brand-dark/85">
            <div className="p-3.5 bg-[#FFF8F5] rounded-2xl border border-brand-stone/60">
              <span className="font-bold block text-brand-taupe uppercase text-[10px] tracking-wider">Identifiant système</span>
              <p className="font-mono font-bold text-sm text-brand-dark mt-0.5">#{utilisateur?.id} ({utilisateur?.nom})</p>
            </div>

            <div className="p-3.5 bg-[#FFF8F5] rounded-2xl border border-brand-stone/60">
              <span className="font-bold block text-brand-taupe uppercase text-[10px] tracking-wider">Type d'accès</span>
              <p className="font-bold text-sm text-brand-burnt mt-0.5">Personnel du Refuge (Sans hiérarchie RBAC)</p>
            </div>

            <div className="p-3.5 bg-[#FFF8F5] rounded-2xl border border-brand-stone/60">
              <span className="font-bold block text-brand-taupe uppercase text-[10px] tracking-wider">Périmètre d'action</span>
              <p className="text-xs text-brand-dark/80 mt-1 leading-relaxed">
                Accès complet aux modules opérationnels : fiches des résidents, traitement des demandes d’adoption, dossiers vétérinaires et registre des dons.
              </p>
            </div>
          </div>
        </div>

        {/* Volet documentation de gouvernance & architecture backend */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-8 rounded-3xl border border-brand-burnt/15 shadow-[0_8px_30px_rgba(52,46,43,0.04)] space-y-6">
          <div className="border-b border-brand-stone/50 pb-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-brand-dark flex items-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-brand-surface text-brand-burnt">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <span>Architecture des Comptes Internes</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
              Spécifications techniques relatives au modèle de sécurité et d'authentification de Rafiq
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-brand-dark/85 leading-relaxed">
            <div className="p-4 bg-brand-surface rounded-2xl border border-brand-burnt/15 space-y-1.5">
              <h3 className="font-bold text-brand-burnt text-sm">1. Provisionnement interne des comptes</h3>
              <p className="text-xs leading-relaxed text-brand-dark/80">
                Conformément aux spécifications du projet Rafiq et aux exigences de sécurité du refuge, <strong>les comptes du personnel ne peuvent pas être créés librement via une interface publique</strong>. Ils sont provisionnés directement dans la table relationnelle <code>personnel</code> par l’administration du refuge.
              </p>
            </div>

            <div className="p-4 bg-brand-surface rounded-2xl border border-brand-burnt/15 space-y-1.5">
              <h3 className="font-bold text-brand-burnt text-sm">2. Absence délibérée de rôles hiérarchiques (Sans RBAC)</h3>
              <p className="text-xs leading-relaxed text-brand-dark/80">
                Le projet ne dispose pas de distinction de rôles (pas de rôles <code>ADMIN</code>, <code>EMPLOYE</code> ou <code>VETERINAIRE</code>). Tous les membres du personnel partagent une visibilité totale et uniforme afin de fluidifier les soins quotidiens et les réponses aux adoptants.
              </p>
            </div>

            <div className="p-4 bg-[#FFF8F5] rounded-2xl border border-brand-stone/60 space-y-2">
              <h3 className="font-bold text-brand-dark text-sm">3. Comptes de démonstration pré-configurés</h3>
              <p className="text-xs text-brand-dark/80">
                La base de données MySQL du projet intègre les comptes de test suivants :
              </p>
              <ul className="text-xs font-mono space-y-1.5 bg-white p-3.5 rounded-xl border border-brand-stone/60 text-brand-dark">
                <li>• <strong>admin</strong> / mot de passe : <code className="bg-brand-surface px-1.5 py-0.5 rounded text-brand-burnt">personnel123</code></li>
                <li>• <strong>soignant</strong> / mot de passe : <code className="bg-brand-surface px-1.5 py-0.5 rounded text-brand-burnt">personnel123</code></li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50/80 text-blue-950 rounded-2xl border border-blue-200 text-xs flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong className="block text-blue-900 mb-0.5">Audit de transparence API :</strong>
                Le backend Java ne possède aucune route publique de type <code>/personnels</code> en écriture ou lecture pour prévenir l'exposition des identifiants internes. Le frontend respecte rigoureusement ce contrat d'API sans fabriquer de faux endpoints.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
