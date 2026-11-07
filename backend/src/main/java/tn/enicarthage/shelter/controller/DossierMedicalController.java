package tn.enicarthage.shelter.controller;

import java.util.List;

import tn.enicarthage.shelter.dto.DossierMedicalRequest;
import tn.enicarthage.shelter.dto.DossierMedicalResponse;
import tn.enicarthage.shelter.service.DossierMedicalService;

public class DossierMedicalController {

    private final DossierMedicalService dossierMedicalService;

    public DossierMedicalController() {
        this.dossierMedicalService = new DossierMedicalService();
    }

    public List<DossierMedicalResponse> lister() {
        return dossierMedicalService.getAllDossiers();
    }

    public DossierMedicalResponse obtenir(int id) {
        return dossierMedicalService.getDossierById(id);
    }

    public DossierMedicalResponse creer(DossierMedicalRequest request) {
        return dossierMedicalService.createDossier(request);
    }

    public DossierMedicalResponse modifier(int id, DossierMedicalRequest request) {
        return dossierMedicalService.updateDossier(id, request);
    }

    public void supprimer(int id) {
        dossierMedicalService.deleteDossier(id);
    }
}
