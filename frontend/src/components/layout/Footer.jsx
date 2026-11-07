import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 border-t border-brand-burnt/30" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Rangée supérieure : Logo, Marque et Mission */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-10 border-b border-white/10 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-burnt flex items-center justify-center text-white shadow-warm-sm">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <ellipse cx="8.5" cy="5" rx="1.75" ry="2.5" />
                <ellipse cx="15.5" cy="5" rx="1.75" ry="2.5" />
                <ellipse cx="4.75" cy="9.5" rx="1.6" ry="2.2" />
                <ellipse cx="19.25" cy="9.5" rx="1.6" ry="2.2" />
                <path d="M12 10.2c-3.1 0-5.7 2.1-5.7 4.9 0 2.2 1.6 3.9 3.5 3.9.9 0 1.6-.4 2.2-1 .6.6 1.3 1 2.2 1 1.9 0 3.5-1.7 3.5-3.9 0-2.8-2.6-4.9-5.7-4.9z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Rafiq <span className="font-arabic font-normal text-brand-peach text-2xl leading-none">| رفيق</span>
              </span>
              <p className="text-xs text-brand-peach/80">Plateforme de refuge et sanctuaire d’adoption</p>
            </div>
          </div>
          <p className="text-brand-cream/80 text-sm max-w-md font-light leading-relaxed">
            Chaque animal mérite un compagnon. Dédié à relier les animaux secourus avec des familles aimantes et responsables.
          </p>
        </div>

        {/* Rangée centrale : Colonnes éditoriales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-white/10 text-sm">
          {/* Colonne 1 : Navigation */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-brand-peach mb-4">
              Explorer Rafiq
            </h4>
            <ul className="space-y-2.5 text-white/70">
              <li>
                <Link to="/animaux" className="hover:text-white transition-colors">
                  Explorer les animaux
                </Link>
              </li>
              <li>
                <a href="/#adoption-process" className="hover:text-white transition-colors">
                  Processus d’adoption
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Espace connexion
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Devenir adoptant
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 2 : Horaires de visite */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-brand-peach mb-4">
              Horaires &amp; Visites
            </h4>
            <p className="text-white/70 leading-relaxed text-xs">
              Jardins sensoriels &amp; Refuge Rafiq<br />
              Centre de protection animale<br />
              Tunis, Tunisie
            </p>
            <p className="text-brand-peach font-semibold mt-2 text-xs">
              Ouvert tous les jours : 10h00 – 18h00
            </p>
          </div>

          {/* Colonne 3 : Ligne d'assistance & Contact */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-brand-peach mb-4">
              Assistance &amp; Équipe
            </h4>
            <p className="text-white/70 text-xs">Ligne directe d'adoption :</p>
            <p className="text-lg font-bold text-white mb-2">+1 (800) 555-RAFIQ</p>
            <p className="text-white/70 text-xs">contact@rafiq-refuge.org</p>
          </div>

          {/* Colonne 4 : Engagement éthique */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-brand-peach mb-4">
              Engagement Éthique
            </h4>
            <p className="text-white/70 text-xs leading-relaxed">
              Rafiq est un sanctuaire à but non lucratif garantissant la transparence des soins vétérinaires et le bien-être continu des animaux accueillis.
            </p>
            <span className="inline-block mt-3 px-2.5 py-1 rounded bg-white/10 text-[11px] font-mono text-brand-peach">
              Réf. Sanctuaire : TN-SHELTER-2026
            </span>
          </div>
        </div>

        {/* Rangée inférieure : Droits d'auteur et mentions */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© 2026 Plateforme de refuge animalier Rafiq. Tous droits réservés.</p>
          <div className="flex items-center space-x-6">
            <span>Charte de bien-être animal</span>
            <span>•</span>
            <span>Protocole de rencontre en sanctuaire</span>
            <span>•</span>
            <span>Données hébergées en conformité</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
