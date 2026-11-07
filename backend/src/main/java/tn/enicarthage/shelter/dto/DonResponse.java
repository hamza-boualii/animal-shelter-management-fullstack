package tn.enicarthage.shelter.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import tn.enicarthage.shelter.model.Don;
import tn.enicarthage.shelter.model.TypeDon;

public class DonResponse {

    private int id;
    private int personnelId;
    private TypeDon typeDon;
    private BigDecimal valeur;
    private String description;
    private LocalDate date;
    private String nomDonateur;
    private String telephoneDonateur;
    private String photoUrl;

    public DonResponse() {
    }

    public static DonResponse from(Don don) {
        DonResponse response = new DonResponse();
        response.setId(don.getId());
        response.setPersonnelId(don.getPersonnelId());
        response.setTypeDon(don.getTypeDon());
        response.setValeur(don.getValeur());
        response.setDescription(don.getDescription());
        response.setDate(don.getDate());
        response.setNomDonateur(don.getNomDonateur());
        response.setTelephoneDonateur(don.getTelephoneDonateur());
        response.setPhotoUrl(don.getPhotoUrl());
        return response;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

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
