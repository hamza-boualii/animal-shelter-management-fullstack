import { useState } from 'react'

export default function AnimalPhoto({ src, alt, className = '', loading }) {
  const [erreur, setErreur] = useState(false)

  if (!src || erreur) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-brand-surface text-brand-taupe/60 ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setErreur(true)}
    />
  )
}
