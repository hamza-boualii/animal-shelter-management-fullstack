package tn.enicarthage.shelter.dto;

import tn.enicarthage.shelter.model.Adoptant;

public class AdoptantResponse {

    private int id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;

    public AdoptantResponse() {
    }

    public AdoptantResponse(int id, String nom, String prenom, String email, String telephone) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
    }

    public static AdoptantResponse from(Adoptant adoptant) {
        return new AdoptantResponse(
                adoptant.getId(),
                adoptant.getNom(),
                adoptant.getPrenom(),
                adoptant.getEmail(),
                adoptant.getTelephone()
        );
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
}
