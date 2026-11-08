import PersonnelNav from '../personnel/PersonnelNav'
import PersonnelPageTransition from '../personnel/PersonnelPageTransition'

export default function PersonnelLayout() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <PersonnelNav />
      <PersonnelPageTransition />
    </div>
  )
}
