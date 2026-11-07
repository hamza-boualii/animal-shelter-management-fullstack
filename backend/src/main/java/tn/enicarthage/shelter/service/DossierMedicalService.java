package tn.enicarthage.shelter.service;

import java.util.ArrayList;
import java.util.List;

import tn.enicarthage.shelter.dao.AnimalDAO;
import tn.enicarthage.shelter.dao.DossierMedicalDAO;
import tn.enicarthage.shelter.dao.PersonnelDAO;
import tn.enicarthage.shelter.dto.DossierMedicalRequest;
import tn.enicarthage.shelter.dto.DossierMedicalResponse;
import tn.enicarthage.shelter.exception.ResourceNotFoundException;
import tn.enicarthage.shelter.model.DossierMedical;
import tn.enicarthage.shelter.util.ValidationUtil;

public class DossierMedicalService {

    private final DossierMedicalDAO dossierDAO;
    private final AnimalDAO animalDAO;
    private final PersonnelDAO personnelDAO;

    public DossierMedicalService() {
        this.dossierDAO = new DossierMedicalDAO();
        this.animalDAO = new AnimalDAO();
        this.personnelDAO = new PersonnelDAO();
    }

    public List<DossierMedicalResponse> getAllDossiers() {
        List<DossierMedicalResponse> responses = new ArrayList<>();
        for (DossierMedical dossier : dossierDAO.findAll()) {
            responses.add(DossierMedicalResponse.from(dossier));
        }
        return responses;
    }

    public DossierMedicalResponse getDossierById(int id) {
        return DossierMedicalResponse.from(findDossier(id));
    }

    public DossierMedicalResponse createDossier(DossierMedicalRequest request) {
        valider(request);
        verifierReferences(request);

        DossierMedical dossier = construire(request);
        dossierDAO.create(dossier);
        return DossierMedicalResponse.from(dossier);
    }

    public DossierMedicalResponse updateDossier(int id, DossierMedicalRequest request) {
        DossierMedical existant = findDossier(id);
        valider(request);
        verifierReferences(request);

        DossierMedical dossier = construire(request);
        dossier.setId(existant.getId());
        dossierDAO.update(dossier);
        return DossierMedicalResponse.from(dossier);
    }

    public void deleteDossier(int id) {
        findDossier(id);
        dossierDAO.delete(id);
    }

    private DossierMedical findDossier(int id) {
        DossierMedical dossier = dossierDAO.findById(id);
        if (dossier == null) {
            throw new ResourceNotFoundException("Dossier medical introuvable : " + id);
        }
        return dossier;
    }

    private void valider(DossierMedicalRequest request) {
        ValidationUtil.requirePositive(request.getAnimalId(), "L'animal est obligatoire.");
        ValidationUtil.requirePositive(request.getPersonnelId(), "Le personnel est obligatoire.");
    }

    private void verifierReferences(DossierMedicalRequest request) {
        if (animalDAO.findById(request.getAnimalId()) == null) {
            throw new ResourceNotFoundException("Animal introuvable : " + request.getAnimalId());
        }
        if (personnelDAO.findById(request.getPersonnelId()) == null) {
            throw new ResourceNotFoundException("Personnel introuvable : " + request.getPersonnelId());
        }
    }

    private DossierMedical construire(DossierMedicalRequest request) {
        DossierMedical dossier = new DossierMedical();
        dossier.setAnimalId(request.getAnimalId());
        dossier.setPersonnelId(request.getPersonnelId());
        dossier.setSterilise(request.isSterilise());
        dossier.setAllergies(request.getAllergies());
        dossier.setVaccinsRecus(request.getVaccinsRecus());
        dossier.setTraitementsEnCours(request.getTraitementsEnCours());
        dossier.setDescription(request.getDescription());
        dossier.setPhotoUrls(request.getPhotoUrls());
        return dossier;
    }
}
