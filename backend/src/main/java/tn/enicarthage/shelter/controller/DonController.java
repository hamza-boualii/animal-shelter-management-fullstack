package tn.enicarthage.shelter.controller;

import java.util.List;

import tn.enicarthage.shelter.dto.DonRequest;
import tn.enicarthage.shelter.dto.DonResponse;
import tn.enicarthage.shelter.service.DonService;

public class DonController {

    private final DonService donService;

    public DonController() {
        this.donService = new DonService();
    }

    public List<DonResponse> lister() {
        return donService.getAllDons();
    }

    public DonResponse obtenir(int id) {
        return donService.getDonById(id);
    }

    public DonResponse creer(DonRequest request) {
        return donService.createDon(request);
    }

    public DonResponse modifier(int id, DonRequest request) {
        return donService.updateDon(id, request);
    }

    public void supprimer(int id) {
        donService.deleteDon(id);
    }
}
