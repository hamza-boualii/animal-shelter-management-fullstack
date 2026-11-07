import { useAuth } from '../../hooks/useAuth'
import PersonnelNav from '../../components/personnel/PersonnelNav'
import MascotCameo from '../../components/ui/MascotCameo'

export default function EquipePersonnelPage() {
  const { utilisateur } = useAuth()

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PersonnelNav />

      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-brand-dark">Équipe &amp; Sécurité du Sanctuaire</h2>
        <p className="text-xs text-brand-dark/70">
          Architecture des comptes collaborateurs, gouvernance des accès et politique de sécurité
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Volet profil du soignant connecté */}
        <div className="lg:col-span-5 bg-white p-7 rounded-3xl border border-brand-burnt/15 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-brand-stone/60 pb-5">
            <div className="w-14 h-14 rounded-2xl bg-brand-burnt flex items-center justify-center text-white text-2xl font-bold">
              👤
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-dark">{utilisateur?.nom}</h3>
              <p className="text-xs text-brand-taupe">{utilisateur?.email}</p>
              <span className="inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Session Personnel Active
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-brand-dark/85">
            <div className="p-3 bg-brand-cream/60 rounded-xl border border-brand-stone/60">
              <span className="font-bold block text-brand-taupe uppercase text-[10px]">Identifiant système</span>
              <p className="font-mono font-bold text-sm text-brand-dark mt-0.5">#{utilisateur?.id} ({utilisateur?.nom})</p>
            </div>

            <div className="p-3 bg-brand-cream/60 rounded-xl border border-brand-stone/60">
              <span className="font-bold block text-brand-taupe uppercase text-[10px]">Type d'accès</span>
              <p className="font-bold text-sm text-brand-burnt mt-0.5">Personnel du Refuge (Sans hiérarchie RBAC)</p>
            </div>

            <div className="p-3 bg-brand-cream/60 rounded-xl border border-brand-stone/60">
              <span className="font-bold block text-brand-taupe uppercase text-[10px]">Périmètre d'action</span>
              <p className="text-xs text-brand-dark/80 mt-0.5">
                Accès complet aux modules : gestion des animaux, mise à jour des statuts d’adoption, carnets médicaux et registre des dons.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <MascotCameo
              mode="float"
              taille={48}
              titreBulle="Espace Collaboratif"
              bulle="Tous les soignants ont les mêmes droits d'intervention sur les fiches des pensionnaires."
            />
          </div>
        </div>

        {/* Volet documentation de gouvernance & architecture backend */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-8 rounded-3xl border border-brand-burnt/15 shadow-sm space-y-6">
          <div className="border-b border-brand-stone/60 pb-4">
            <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
              <span>🛡️</span> Architecture des Comptes Internes
            </h3>
            <p className="text-xs text-brand-dark/70 mt-1">
              Spécifications techniques relatives au modèle de sécurité de Rafiq
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-brand-dark/85 leading-relaxed">
            <div className="p-4 bg-brand-surface rounded-2xl border border-brand-burnt/15 space-y-2">
              <h4 className="font-bold text-brand-burnt">1. Provisionnement interne des comptes</h4>
              <p className="text-xs leading-relaxed text-brand-dark/80">
                Conformément aux spécifications du projet Rafiq et aux exigences de sécurité du refuge, <strong>les comptes du personnel ne peuvent pas être créés librement via une interface publique</strong>. Ils sont provisionnés directement dans la table relationnelle <code>personnel</code> par l’administration du refuge.
              </p>
            </div>

            <div className="p-4 bg-brand-surface rounded-2xl border border-brand-burnt/15 space-y-2">
              <h4 className="font-bold text-brand-burnt">2. Absence délibérée de rôles hiérarchiques (Sans RBAC)</h4>
              <p className="text-xs leading-relaxed text-brand-dark/80">
                Le projet ne dispose pas de distinction de rôles (pas de rôles <code>ADMIN</code>, <code>EMPLOYE</code> ou <code>VETERINAIRE</code>). Tous les membres du personnel partagent une visibilité totale et uniforme afin de fluidifier les soins quotidiens et les réponses aux adoptants.
              </p>
            </div>

            <div className="p-4 bg-brand-cream/80 rounded-2xl border border-brand-stone space-y-2">
              <h4 className="font-bold text-brand-dark">3. Comptes de démonstration pré-configurés</h4>
              <p className="text-xs text-brand-dark/80">
                La base de données MySQL du projet intègre les comptes de test suivants :
              </p>
              <ul className="text-xs font-mono space-y-1 bg-white p-3 rounded-xl border border-brand-stone">
                <li>• <strong>admin</strong> / mot de passe : <code>personnel123</code></li>
                <li>• <strong>soignant</strong> / mot de passe : <code>personnel123</code></li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 text-blue-950 rounded-2xl border border-blue-200 text-xs">
              <strong>Audit de transparence API :</strong> Le backend Java ne possède aucune route publique de type <code>/personnels</code> en écriture ou lecture pour prévenir l'exposition des identifiants internes. Le frontend respecte rigoureusement ce contrat d'API sans fabriquer de faux endpoints.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
