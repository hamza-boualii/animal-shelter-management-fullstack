export function formaterPoids(valeur) {
  if (valeur === null || valeur === undefined || valeur === '') return '-'

  const nombre = Number(valeur)
  if (!Number.isFinite(nombre)) return '-'

  return `${nombre.toFixed(2)} kg`
}
