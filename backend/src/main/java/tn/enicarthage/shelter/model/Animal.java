package tn.enicarthage.shelter.model;

import java.time.LocalDate;

public class Animal {

    private int id;
    private int personnelId;
    private String nom;
    private Espece espece;
    private String race;
    private Sexe sexe;
    private int age;
    private String description;
    private String photoUrl;
    private StatutAnimal statut;
    private LocalDate dateArrivee;

    public Animal() {
    }

    public Animal(int id, int personnelId, String nom, Espece espece, String race,
                  Sexe sexe, int age, String description, String photoUrl,
                  StatutAnimal statut, LocalDate dateArrivee) {
        this.id = id;
        this.personnelId = personnelId;
        this.nom = nom;
        this.espece = espece;
        this.race = race;
        this.sexe = sexe;
        this.age = age;
        this.description = description;
        this.photoUrl = photoUrl;
        this.statut = statut;
        this.dateArrivee = dateArrivee;
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
