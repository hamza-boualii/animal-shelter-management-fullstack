package tn.enicarthage.shelter.dto;

public class LoginResponse {

    private int id;
    private String role;
    private String nom;
    private String email;

    public LoginResponse() {
    }

    public LoginResponse(int id, String role, String nom, String email) {
        this.id = id;
        this.role = role;
        this.nom = nom;
        this.email = email;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
