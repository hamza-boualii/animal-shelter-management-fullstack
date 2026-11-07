export default function Chargement({ message = 'Chargement en cours...', hauteurPleine = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${
        hauteurPleine ? 'min-h-[60vh]' : 'py-12'
      }`}
    >
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-brand-burnt/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-brand-burnt border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-brand-surface flex items-center justify-center text-xl">
          🐾
        </div>
      </div>
      <p className="text-sm font-semibold text-brand-dark/80">{message}</p>
      <p className="text-xs text-brand-taupe mt-1 font-arabic">رفيق رعاية الحيوان</p>
    </div>
  )
}
