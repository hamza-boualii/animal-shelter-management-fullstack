package tn.enicarthage.shelter.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import tn.enicarthage.shelter.model.Animal;
import tn.enicarthage.shelter.model.Espece;
import tn.enicarthage.shelter.model.Sexe;
import tn.enicarthage.shelter.model.StatutAnimal;

public class AnimalResponse {

    private int id;
    private int personnelId;
    private String nom;
    private Espece espece;
    private String race;
    private Sexe sexe;
    private int age;
    private BigDecimal poids;
    private String description;
    private String photoUrl;
    private StatutAnimal statut;
    private LocalDate dateArrivee;

    public AnimalResponse() {
    }

    public static AnimalResponse from(Animal animal) {
        AnimalResponse response = new AnimalResponse();
        response.setId(animal.getId());
        response.setPersonnelId(animal.getPersonnelId());
        response.setNom(animal.getNom());
        response.setEspece(animal.getEspece());
        response.setRace(animal.getRace());
        response.setSexe(animal.getSexe());
        response.setAge(animal.getAge());
        response.setPoids(animal.getPoids());
        response.setDescription(animal.getDescription());
        response.setPhotoUrl(animal.getPhotoUrl());
        response.setStatut(animal.getStatut());
        response.setDateArrivee(animal.getDateArrivee());
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

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Espece getEspece() {
        return espece;
    }

    public void setEspece(Espece espece) {
        this.espece = espece;
    }

    public String getRace() {
        return race;
    }

    public void setRace(String race) {
        this.race = race;
    }

    public Sexe getSexe() {
        return sexe;
    }

    public void setSexe(Sexe sexe) {
        this.sexe = sexe;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public BigDecimal getPoids() {
        return poids;
    }

    public void setPoids(BigDecimal poids) {
        this.poids = poids;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public StatutAnimal getStatut() {
        return statut;
    }

    public void setStatut(StatutAnimal statut) {
        this.statut = statut;
    }

    public LocalDate getDateArrivee() {
        return dateArrivee;
    }

    public void setDateArrivee(LocalDate dateArrivee) {
        this.dateArrivee = dateArrivee;
    }
}
