package tn.enicarthage.shelter.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import tn.enicarthage.shelter.model.TypeDon;

public class DonRequest {

    private int personnelId;
    private TypeDon typeDon;
    private BigDecimal valeur;
    private String description;
    private LocalDate date;
    private String nomDonateur;
    private String telephoneDonateur;
    private String photoUrl;

    public int getPersonnelId() {
        return personnelId;
    }

    public void setPersonnelId(int personnelId) {
        this.personnelId = personnelId;
    }

    public TypeDon getTypeDon() {
        return typeDon;
    }

    public void setTypeDon(TypeDon typeDon) {
        this.typeDon = typeDon;
    }

    public BigDecimal getValeur() {
        return valeur;
    }

    public void setValeur(BigDecimal valeur) {
        this.valeur = valeur;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getNomDonateur() {
        return nomDonateur;
    }

    public void setNomDonateur(String nomDonateur) {
        this.nomDonateur = nomDonateur;
    }

    public String getTelephoneDonateur() {
        return telephoneDonateur;
    }

    public void setTelephoneDonateur(String telephoneDonateur) {
        this.telephoneDonateur = telephoneDonateur;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
