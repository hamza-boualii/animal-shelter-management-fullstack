package tn.enicarthage.shelter.controller;

import tn.enicarthage.shelter.dto.AdoptantRequest;
import tn.enicarthage.shelter.dto.AdoptantResponse;
import tn.enicarthage.shelter.service.AdoptantService;

public class AdoptantController {

    private final AdoptantService adoptantService;

    public AdoptantController() {
        this.adoptantService = new AdoptantService();
    }

    public AdoptantResponse creer(AdoptantRequest request) {
        return adoptantService.createAdoptant(request);
    }
}
