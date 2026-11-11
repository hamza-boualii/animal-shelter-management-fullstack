/**
 * Constantes de l'application Rafiq conformes au backend Java et à la base de données.
 */

export const ESPECES = {
  CHIEN: { label: 'Chien', icone: '🐕' },
  CHAT: { label: 'Chat', icone: '🐈' },
  AUTRE: { label: 'Autre', icone: '🐾' },
}

export const SEXES = {
  MALE: { label: 'Mâle', symbole: '♂' },
  FEMELLE: { label: 'Femelle', symbole: '♀' },
}

export const STATUTS_ANIMAL = {
  DISPONIBLE: {
    label: 'Disponible',
    badgeClass: 'bg-[#DEF7EC] text-[#03543F] border-[#DEF7EC]',
    description: 'Prêt à être adopté immédiatement',
  },
  EN_ATTENTE_ADOPTION: {
    label: 'En attente',
    badgeClass: 'bg-[#F7EDE2] text-[#9E4211] border-[#F7EDE2]',
    description: 'Une demande est en cours d’évaluation',
  },
  EN_SOIN: {
    label: 'En soins',
    badgeClass: 'bg-[#E1EFFE] text-[#1E429F] border-[#E1EFFE]',
    description: 'Actuellement pris en charge par l’équipe de soins',
  },
  ADOPTE: {
    label: 'Adopté',
    badgeClass: 'bg-[#F3F4F6] text-[#4B5563] border-[#F3F4F6]',
    description: 'A trouvé son foyer pour la vie',
  },
}

export const STATUTS_DEMANDE = {
  EN_ATTENTE: {
    label: 'En attente',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  ACCEPTEE: {
    label: 'Acceptée',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  REFUSEE: {
    label: 'Refusée',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
  },
}

export const TYPES_DON = {
  ARGENT: { label: 'Financier', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  NATURE: { label: 'Matériel / Soins', badgeClass: 'bg-orange-100 text-orange-800 border-orange-200' },
}

export const ROLES = {
  ADOPTANT: 'ADOPTANT',
  PERSONNEL: 'PERSONNEL',
}

export const DEFAULT_ANIMAL_IMAGES = {
  CHIEN: '/images/animals/golden-retriever.png',
  CHAT: '/images/animals/sleeping-kitten.png',
  AUTRE: '/images/animals/animal-2.png',
}
