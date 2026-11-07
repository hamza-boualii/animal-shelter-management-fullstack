package tn.enicarthage.shelter.dto;

import java.time.LocalDate;

import tn.enicarthage.shelter.model.DemandeAdoption;
import tn.enicarthage.shelter.model.StatutDemande;

public class DemandeAdoptionResponse {

    private int id;
    private int animalId;
    private int adoptantId;
    private LocalDate dateDemande;
    private StatutDemande statut;
    private String motif;

    public DemandeAdoptionResponse() {
    }

    public static DemandeAdoptionResponse from(DemandeAdoption demande) {
        DemandeAdoptionResponse response = new DemandeAdoptionResponse();
        response.setId(demande.getId());
        response.setAnimalId(demande.getAnimalId());
        response.setAdoptantId(demande.getAdoptantId());
        response.setDateDemande(demande.getDateDemande());
        response.setStatut(demande.getStatut());
        response.setMotif(demande.getMotif());
        return response;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAnimalId() {
        return animalId;
    }

    public void setAnimalId(int animalId) {
        this.animalId = animalId;
    }

    public int getAdoptantId() {
        return adoptantId;
    }

    public void setAdoptantId(int adoptantId) {
        this.adoptantId = adoptantId;
    }

    public LocalDate getDateDemande() {
        return dateDemande;
    }

    public void setDateDemande(LocalDate dateDemande) {
        this.dateDemande = dateDemande;
    }

    public StatutDemande getStatut() {
        return statut;
    }

    public void setStatut(StatutDemande statut) {
        this.statut = statut;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }
}
