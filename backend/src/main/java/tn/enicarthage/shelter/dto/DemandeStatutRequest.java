package tn.enicarthage.shelter.dto;

import tn.enicarthage.shelter.model.StatutDemande;

public class DemandeStatutRequest {

    private StatutDemande statut;

    public StatutDemande getStatut() {
        return statut;
    }

    public void setStatut(StatutDemande statut) {
        this.statut = statut;
    }
}
