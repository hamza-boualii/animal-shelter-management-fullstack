import { useEffect, useRef, useState } from 'react'

export default function AnimalFilters({ filtres, onChangeFiltres }) {
  const [dropdownOuvert, setDropdownOuvert] = useState(null)
  const containerRef = useRef(null)

  const majFiltre = (cle, valeur) => {
    onChangeFiltres({ ...filtres, [cle]: valeur })
  }

  const especesOptions = [
    { code: 'TOUS', label: 'Toutes les espèces' },
    { code: 'CHIEN', label: 'Chiens' },
    { code: 'CHAT', label: 'Chats' },
    { code: 'AUTRE', label: 'Autres' },
  ]

  const statutsOptions = [
    { code: 'TOUS', label: 'Tous les statuts', dotColor: 'bg-gray-300' },
    { code: 'DISPONIBLE', label: 'Disponible', dotColor: 'bg-[#03543F]' },
    { code: 'EN_ATTENTE_ADOPTION', label: 'En attente', dotColor: 'bg-[#9E4211]' },
    { code: 'EN_SOIN', label: 'En soins', dotColor: 'bg-[#1E429F]' },
    { code: 'ADOPTE', label: 'Adopté', dotColor: 'bg-[#4B5563]' },
  ]

  useEffect(() => {
    function gererClicExterieur(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDropdownOuvert(null)
      }
    }

    function gererTouche(event) {
      if (event.key === 'Escape') {
        setDropdownOuvert(null)
      }
    }

    document.addEventListener('mousedown', gererClicExterieur)
    document.addEventListener('keydown', gererTouche)
    return () => {
      document.removeEventListener('mousedown', gererClicExterieur)
      document.removeEventListener('keydown', gererTouche)
    }
  }, [])

  const optionEspeceSelectionnee = especesOptions.find((opt) => opt.code === filtres.espece)
  const labelEspeceAffiche = optionEspeceSelectionnee ? optionEspeceSelectionnee.label : 'Toutes les espèces'

  const optionStatutSelectionnee = statutsOptions.find((opt) => opt.code === filtres.statut)
  const labelStatutAffiche = optionStatutSelectionnee ? optionStatutSelectionnee.label : 'Tous les statuts'

  const especeFiltree = filtres.espece && filtres.espece !== 'TOUS'
  const statutFiltre = filtres.statut && filtres.statut !== 'TOUS'
  const rechercheFiltree = Boolean(filtres.recherche && filtres.recherche.trim() !== '')
  const aDesFiltresActifs = especeFiltree || statutFiltre || rechercheFiltree

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto flex flex-col gap-4 mb-10">
      <div className="relative z-30 w-full bg-[#FAF0E8] border border-[#E4C8BC] rounded-2xl p-2.5 md:p-3 shadow-xl shadow-[#C65335]/5 flex flex-col md:flex-row items-center gap-3 transition-all">
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C65335]">
            <span className="material-symbols-outlined text-[20px] text-[#C65335]">search</span>
          </div>
          <input
            id="animal-search"
            type="text"
            placeholder="Rechercher par nom, race ou tempérament..."
            value={filtres.recherche || ''}
            onChange={(e) => majFiltre('recherche', e.target.value)}
            className="w-full h-12 pl-11 pr-10 bg-white text-[#342E2B] placeholder:text-[#736B66]/70 rounded-xl border border-[#EDE1D8] hover:border-[#C65335] focus:border-[#C65335] focus:outline-none transition-all text-sm shadow-sm"
          />
          {filtres.recherche && (
            <button
              type="button"
              onClick={() => majFiltre('recherche', '')}
              aria-label="Effacer la recherche"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#736B66] hover:text-[#342E2B] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <div className="relative flex-1 md:flex-none">
            <button
              id="species-toggle-btn"
              type="button"
              aria-expanded={dropdownOuvert === 'espece'}
              aria-haspopup="listbox"
              onClick={() => setDropdownOuvert(dropdownOuvert === 'espece' ? null : 'espece')}
              className="w-full md:w-44 h-12 pl-4 pr-10 bg-white hover:border-[#C65335] focus:border-[#C65335] text-[#342E2B] font-medium text-sm rounded-xl border border-[#EDE1D8] focus:outline-none transition-all cursor-pointer text-left flex items-center justify-between shadow-sm"
            >
              <span id="species-selected-label" className="truncate">{labelEspeceAffiche}</span>
              <span className={`material-symbols-outlined text-[20px] text-[#C65335] transition-transform duration-200 pointer-events-none ${dropdownOuvert === 'espece' ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            {dropdownOuvert === 'espece' && (
              <div
                id="species-menu"
                role="listbox"
                className="absolute left-0 top-full mt-2 w-full md:w-48 bg-white rounded-xl shadow-2xl border border-[#EDE1D8] py-1.5 z-50 text-left divide-y divide-[#EDE1D8]/40"
              >
                {especesOptions.map((opt) => {
                  const estActif = (!filtres.espece && opt.code === 'TOUS') || filtres.espece === opt.code
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        majFiltre('espece', opt.code)
                        setDropdownOuvert(null)
                      }}
                      className={`w-full px-4 py-2.5 text-sm text-left font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        estActif
                          ? 'bg-[#FDF0E9] text-[#C65335]'
                          : 'text-[#342E2B] hover:bg-[#FDF8F5] hover:text-[#C65335]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span
                        className={`material-symbols-outlined text-[16px] text-[#C65335] ${
                          estActif ? '' : 'opacity-0'
                        }`}
                      >
                        check
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="relative flex-1 md:flex-none">
            <button
              id="status-toggle-btn"
              type="button"
              aria-expanded={dropdownOuvert === 'statut'}
              aria-haspopup="listbox"
              onClick={() => setDropdownOuvert(dropdownOuvert === 'statut' ? null : 'statut')}
              className="w-full md:w-44 h-12 pl-4 pr-10 bg-white hover:border-[#C65335] focus:border-[#C65335] text-[#342E2B] font-medium text-sm rounded-xl border border-[#EDE1D8] focus:outline-none transition-all cursor-pointer text-left flex items-center justify-between shadow-sm"
            >
              <span id="status-selected-label" className="truncate">{labelStatutAffiche}</span>
              <span className={`material-symbols-outlined text-[20px] text-[#C65335] transition-transform duration-200 pointer-events-none ${dropdownOuvert === 'statut' ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            {dropdownOuvert === 'statut' && (
              <div
                id="status-menu"
                role="listbox"
                className="absolute right-0 md:left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-[#EDE1D8] py-1.5 z-50 text-left divide-y divide-[#EDE1D8]/40"
              >
                {statutsOptions.map((opt) => {
                  const estActif = (!filtres.statut && opt.code === 'TOUS') || filtres.statut === opt.code
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        majFiltre('statut', opt.code)
                        setDropdownOuvert(null)
                      }}
                      className={`w-full px-4 py-2.5 text-sm text-left font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        estActif
                          ? 'bg-[#FDF0E9] text-[#C65335]'
                          : 'text-[#342E2B] hover:bg-[#FDF8F5] hover:text-[#C65335]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${opt.dotColor}`} />
                        <span>{opt.label}</span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-[16px] text-[#C65335] ${
                          estActif ? '' : 'opacity-0'
                        }`}
                      >
                        check
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="relative shrink-0">
            <button
              id="info-btn"
              type="button"
              aria-controls="info-modal"
              aria-expanded={dropdownOuvert === 'info'}
              onClick={() => setDropdownOuvert(dropdownOuvert === 'info' ? null : 'info')}
              title="Comprendre les statuts"
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#C65335] text-white hover:bg-[#A8442B] border border-[#C65335] transition-all duration-200 cursor-pointer select-none focus:outline-none shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">info</span>
            </button>
            {dropdownOuvert === 'info' && (
              <div
                id="info-modal"
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-5 bg-white rounded-2xl shadow-2xl border border-[#EDE1D8] z-50 text-left transition-all"
              >
                <div className="pb-2.5 mb-1 border-b border-[#EDE1D8]/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold tracking-wide uppercase text-[#342E2B]">Guide des statuts</span>
                    <span className="text-[11px] text-[#736B66] block">Sanctuaire Rafiq</span>
                  </div>
                  <button
                    id="close-info-modal"
                    type="button"
                    aria-label="Fermer le guide des statuts"
                    onClick={() => setDropdownOuvert(null)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#736B66] hover:text-[#C65335] hover:bg-[#FDF0E9] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <div className="flex flex-col divide-y divide-[#EDE1D8]/50">
                  <div className="flex items-start gap-3.5 py-2.5">
                    <span className="w-24 shrink-0 inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#DEF7EC] text-[#03543F] shadow-sm">
                      DISPONIBLE
                    </span>
                    <div className="flex-grow">
                      <p className="text-xs font-semibold text-[#03543F] mb-0.5">Disponible à l’adoption</p>
                      <p className="text-xs text-[#736B66] leading-relaxed">
                        L’animal est prêt à être accueilli. Vous pouvez soumettre une demande d’adoption dès maintenant.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 py-2.5">
                    <span className="w-24 shrink-0 inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#F7EDE2] text-[#9E4211] shadow-sm">
                      EN ATTENTE
                    </span>
                    <div className="flex-grow">
                      <p className="text-xs font-semibold text-[#9E4211] mb-0.5">En attente d’adoption</p>
                      <p className="text-xs text-[#736B66] leading-relaxed">
                        Une adoption est en cours, mais vous pouvez toujours soumettre une demande si celle-ci n’aboutit pas.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 py-2.5">
                    <span className="w-24 shrink-0 inline-flex items-center justify-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E1EFFE] text-[#1E429F] shadow-sm">
                      EN SOINS
                    </span>
                    <div className="flex-grow">
                      <p className="text-xs font-semibold text-[#1E429F] mb-0.5">En soins vétérinaires</p>
                      <p className="text-xs text-[#736B66] leading-relaxed">
                        L’animal reçoit un suivi médical attentif et sera proposé à l’adoption prochainement.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 py-2.5">
                    <span className="w-24 shrink-0 inline-flex items-center justify-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F3F4F6] text-[#4B5563] shadow-sm">
                      ADOPTÉ
                    </span>
                    <div className="flex-grow">
                      <p className="text-xs font-semibold text-[#4B5563] mb-0.5">Adopté avec succès</p>
                      <p className="text-xs text-[#736B66] leading-relaxed">
                        L’animal a trouvé sa famille définitive. Découvrez son parcours et son histoire au sanctuaire !
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {aDesFiltresActifs && (
        <div id="active-chips-container" className="flex flex-wrap items-center gap-2.5 px-2 text-xs">
          <span className="text-[#736B66] font-semibold mr-1">Filtres actifs :</span>
          {especeFiltree && (
            <span id="chip-species" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF0E9] border border-[#EDE1D8] text-[#C65335] font-semibold shadow-sm hover:border-[#C65335] transition-colors">
              <span id="chip-species-text">{labelEspeceAffiche}</span>
              <button
                id="remove-species-filter"
                type="button"
                aria-label="Supprimer le filtre Espèce"
                onClick={() => majFiltre('espece', 'TOUS')}
                className="hover:text-[#342E2B] transition-colors focus:outline-none text-[14px] leading-none ml-0.5 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {statutFiltre && (
            <span id="chip-status" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF0E9] border border-[#EDE1D8] text-[#C65335] font-semibold shadow-sm hover:border-[#C65335] transition-colors">
              <span id="chip-status-text">{labelStatutAffiche}</span>
              <button
                id="remove-status-filter"
                type="button"
                aria-label="Supprimer le filtre Statut"
                onClick={() => majFiltre('statut', 'TOUS')}
                className="hover:text-[#342E2B] transition-colors focus:outline-none text-[14px] leading-none ml-0.5 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {rechercheFiltree && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF0E9] border border-[#EDE1D8] text-[#C65335] font-semibold shadow-sm hover:border-[#C65335] transition-colors">
              <span>« {filtres.recherche} »</span>
              <button
                type="button"
                aria-label="Supprimer la recherche"
                onClick={() => majFiltre('recherche', '')}
                className="hover:text-[#342E2B] transition-colors focus:outline-none text-[14px] leading-none ml-0.5 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          <button
            id="reset-all-filters"
            type="button"
            onClick={() => onChangeFiltres({ recherche: '', espece: 'TOUS', statut: 'TOUS' })}
            className="text-xs text-[#736B66] hover:text-[#C65335] underline ml-2 transition-colors cursor-pointer font-medium"
          >
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  )
}
