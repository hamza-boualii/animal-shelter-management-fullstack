package tn.enicarthage.shelter.model;

public class Personnel {

    private int id;
    private String username;
    private String email;
    private String motDePasse;

    public Personnel() {
    }

    public Personnel(int id, String username, String email, String motDePasse) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.motDePasse = motDePasse;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }
}
