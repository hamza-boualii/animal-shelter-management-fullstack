package tn.enicarthage.shelter.model;

import java.time.LocalDate;

public class DemandeAdoption {

    private int id;
    private int animalId;
    private int adoptantId;
    private LocalDate dateDemande;
    private StatutDemande statut;
    private String motif;

    public DemandeAdoption() {
    }

    public DemandeAdoption(int id, int animalId, int adoptantId, LocalDate dateDemande,
                           StatutDemande statut, String motif) {
        this.id = id;
        this.animalId = animalId;
        this.adoptantId = adoptantId;
        this.dateDemande = dateDemande;
        this.statut = statut;
        this.motif = motif;
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
