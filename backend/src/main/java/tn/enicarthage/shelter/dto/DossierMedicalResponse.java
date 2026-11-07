package tn.enicarthage.shelter.dto;

import tn.enicarthage.shelter.model.DossierMedical;

public class DossierMedicalResponse {

    private int id;
    private int animalId;
    private int personnelId;
    private boolean sterilise;
    private String allergies;
    private String vaccinsRecus;
    private String traitementsEnCours;
    private String description;
    private String photoUrls;

    public DossierMedicalResponse() {
    }

    public static DossierMedicalResponse from(DossierMedical dossier) {
        DossierMedicalResponse response = new DossierMedicalResponse();
        response.setId(dossier.getId());
        response.setAnimalId(dossier.getAnimalId());
        response.setPersonnelId(dossier.getPersonnelId());
        response.setSterilise(dossier.isSterilise());
        response.setAllergies(dossier.getAllergies());
        response.setVaccinsRecus(dossier.getVaccinsRecus());
        response.setTraitementsEnCours(dossier.getTraitementsEnCours());
        response.setDescription(dossier.getDescription());
        response.setPhotoUrls(dossier.getPhotoUrls());
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
