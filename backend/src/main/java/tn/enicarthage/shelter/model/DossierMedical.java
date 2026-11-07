package tn.enicarthage.shelter.model;

public class DossierMedical {

    private int id;
    private int animalId;
    private int personnelId;
    private boolean sterilise;
    private String allergies;
    private String vaccinsRecus;
    private String traitementsEnCours;
    private String description;
    private String photoUrls;

    public DossierMedical() {
    }

    public DossierMedical(int id, int animalId, int personnelId, boolean sterilise,
                          String allergies, String vaccinsRecus, String traitementsEnCours,
                          String description, String photoUrls) {
        this.id = id;
        this.animalId = animalId;
        this.personnelId = personnelId;
        this.sterilise = sterilise;
        this.allergies = allergies;
        this.vaccinsRecus = vaccinsRecus;
        this.traitementsEnCours = traitementsEnCours;
        this.description = description;
        this.photoUrls = photoUrls;
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

    public int getPersonnelId() {
        return personnelId;
    }

    public void setPersonnelId(int personnelId) {
        this.personnelId = personnelId;
    }

    public boolean isSterilise() {
        return sterilise;
    }

    public void setSterilise(boolean sterilise) {
        this.sterilise = sterilise;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getVaccinsRecus() {
        return vaccinsRecus;
    }

    public void setVaccinsRecus(String vaccinsRecus) {
        this.vaccinsRecus = vaccinsRecus;
    }

    public String getTraitementsEnCours() {
        return traitementsEnCours;
    }

    public void setTraitementsEnCours(String traitementsEnCours) {
        this.traitementsEnCours = traitementsEnCours;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhotoUrls() {
        return photoUrls;
    }

    public void setPhotoUrls(String photoUrls) {
        this.photoUrls = photoUrls;
    }
}
