import { useAnimaux } from '../../hooks/useAnimaux'
import HeroSection from '../../components/home/HeroSection'
import FeaturedCarousel from '../../components/home/FeaturedCarousel'
import AdoptionProcess from '../../components/home/AdoptionProcess'

export default function HomePage() {
  const { tousLesAnimaux } = useAnimaux()

  return (
    <div className="flex flex-col">
      <HeroSection totalAnimaux={tousLesAnimaux.length} />
      <FeaturedCarousel animaux={tousLesAnimaux} />
      <AdoptionProcess />
    </div>
  )
}
