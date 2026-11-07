package tn.enicarthage.shelter.service;

import tn.enicarthage.shelter.dao.AdoptantDAO;
import tn.enicarthage.shelter.dto.AdoptantRequest;
import tn.enicarthage.shelter.dto.AdoptantResponse;
import tn.enicarthage.shelter.dto.LoginRequest;
import tn.enicarthage.shelter.dto.LoginResponse;
import tn.enicarthage.shelter.model.Adoptant;
import tn.enicarthage.shelter.util.ValidationUtil;

public class AdoptantService {

    private final AdoptantDAO adoptantDAO;

    public AdoptantService() {
        this.adoptantDAO = new AdoptantDAO();
    }

    public AdoptantResponse createAdoptant(AdoptantRequest request) {
        ValidationUtil.requireText(request.getNom(), "Le nom est obligatoire.");
        ValidationUtil.requireText(request.getPrenom(), "Le prenom est obligatoire.");
        ValidationUtil.requireText(request.getEmail(), "L'email est obligatoire.");
        ValidationUtil.requireText(request.getMotDePasse(), "Le mot de passe est obligatoire.");

        if (!request.getEmail().contains("@")) {
            throw new IllegalArgumentException("L'email est invalide.");
        }

        if (adoptantDAO.findByEmail(request.getEmail()) != null) {
            throw new IllegalArgumentException("Un compte avec cet email existe deja.");
        }

        Adoptant adoptant = new Adoptant();
        adoptant.setNom(request.getNom());
        adoptant.setPrenom(request.getPrenom());
        adoptant.setEmail(request.getEmail());
        adoptant.setMotDePasse(request.getMotDePasse());
        adoptant.setTelephone(request.getTelephone());

        adoptantDAO.create(adoptant);
        return AdoptantResponse.from(adoptant);
    }

    public LoginResponse authenticate(LoginRequest request) {
        ValidationUtil.requireText(request.getIdentifiant(), "L'email est obligatoire.");
        ValidationUtil.requireText(request.getMotDePasse(), "Le mot de passe est obligatoire.");

        Adoptant adoptant = adoptantDAO.findByEmail(request.getIdentifiant());
        if (adoptant == null || !adoptant.getMotDePasse().equals(request.getMotDePasse())) {
            throw new IllegalArgumentException("Email ou mot de passe incorrect.");
        }

        return new LoginResponse(
                adoptant.getId(),
                "ADOPTANT",
                adoptant.getNom() + " " + adoptant.getPrenom(),
                adoptant.getEmail()
        );
    }
}
