package tn.enicarthage.shelter.controller;

import java.util.List;

import tn.enicarthage.shelter.dto.DemandeAdoptionRequest;
import tn.enicarthage.shelter.dto.DemandeAdoptionResponse;
import tn.enicarthage.shelter.dto.DemandeStatutRequest;
import tn.enicarthage.shelter.service.DemandeAdoptionService;

public class DemandeAdoptionController {

    private final DemandeAdoptionService demandeAdoptionService;

    public DemandeAdoptionController() {
        this.demandeAdoptionService = new DemandeAdoptionService();
    }

    public List<DemandeAdoptionResponse> lister() {
        return demandeAdoptionService.getAllDemandes();
    }

    public DemandeAdoptionResponse obtenir(int id) {
        return demandeAdoptionService.getDemandeById(id);
    }

    public DemandeAdoptionResponse creer(DemandeAdoptionRequest request) {
        return demandeAdoptionService.createDemande(request);
    }

    public DemandeAdoptionResponse modifierStatut(int id, DemandeStatutRequest request) {
        return demandeAdoptionService.updateStatut(id, request);
    }
}
