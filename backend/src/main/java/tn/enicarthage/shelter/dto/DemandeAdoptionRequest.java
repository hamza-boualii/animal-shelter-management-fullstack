package tn.enicarthage.shelter.dto;

public class DemandeAdoptionRequest {

    private int animalId;
    private int adoptantId;
    private String motif;

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

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }
}
