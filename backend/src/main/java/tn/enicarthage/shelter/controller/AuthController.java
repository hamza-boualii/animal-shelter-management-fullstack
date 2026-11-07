package tn.enicarthage.shelter.controller;

import tn.enicarthage.shelter.dto.LoginRequest;
import tn.enicarthage.shelter.dto.LoginResponse;
import tn.enicarthage.shelter.service.AdoptantService;
import tn.enicarthage.shelter.service.PersonnelService;

public class AuthController {

    private final AdoptantService adoptantService;
    private final PersonnelService personnelService;

    public AuthController() {
        this.adoptantService = new AdoptantService();
        this.personnelService = new PersonnelService();
    }

    public LoginResponse connecterAdoptant(LoginRequest request) {
        return adoptantService.authenticate(request);
    }

    public LoginResponse connecterPersonnel(LoginRequest request) {
        return personnelService.authenticate(request);
    }
}
