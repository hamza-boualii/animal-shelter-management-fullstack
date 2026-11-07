import { Link } from 'react-router-dom'
import Bouton from '../../components/ui/Bouton'
import MascotCameo from '../../components/ui/MascotCameo'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="bg-white p-10 rounded-3xl border border-brand-burnt/20 shadow-warm-lg text-center max-w-lg mx-auto space-y-6">
        <MascotCameo mode="bounce" taille={72} className="justify-center" />
        <div>
          <span className="text-4xl font-black text-brand-burnt">404</span>
          <h2 className="text-2xl font-extrabold text-brand-dark mt-1">Page introuvable</h2>
          <p className="text-xs sm:text-sm text-brand-dark/75 mt-2 leading-relaxed">
            Ce chemin ne mène à aucun espace du sanctuaire. Ne vous inquiétez pas, nos compagnons sont toujours à l’accueil !
          </p>
        </div>
        <div className="pt-2">
          <Link to="/">
            <Bouton variant="primary" size="md">
              Retour à l’accueil
            </Bouton>
          </Link>
        </div>
      </div>
    </div>
  )
}
