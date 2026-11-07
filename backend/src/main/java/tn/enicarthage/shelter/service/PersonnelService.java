package tn.enicarthage.shelter.service;

import tn.enicarthage.shelter.dao.PersonnelDAO;
import tn.enicarthage.shelter.dto.LoginRequest;
import tn.enicarthage.shelter.dto.LoginResponse;
import tn.enicarthage.shelter.model.Personnel;
import tn.enicarthage.shelter.util.ValidationUtil;

public class PersonnelService {

    private final PersonnelDAO personnelDAO;

    public PersonnelService() {
        this.personnelDAO = new PersonnelDAO();
    }

    public LoginResponse authenticate(LoginRequest request) {
        ValidationUtil.requireText(request.getIdentifiant(), "Le nom d'utilisateur est obligatoire.");
        ValidationUtil.requireText(request.getMotDePasse(), "Le mot de passe est obligatoire.");

        Personnel personnel = personnelDAO.findByUsername(request.getIdentifiant());
        if (personnel == null || !personnel.getMotDePasse().equals(request.getMotDePasse())) {
            throw new IllegalArgumentException("Nom d'utilisateur ou mot de passe incorrect.");
        }

        return new LoginResponse(
                personnel.getId(),
                "PERSONNEL",
                personnel.getUsername(),
                personnel.getEmail()
        );
    }
}
