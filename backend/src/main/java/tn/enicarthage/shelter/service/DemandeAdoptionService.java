package tn.enicarthage.shelter.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import tn.enicarthage.shelter.dao.AdoptantDAO;
import tn.enicarthage.shelter.dao.AnimalDAO;
import tn.enicarthage.shelter.dao.DemandeAdoptionDAO;
import tn.enicarthage.shelter.dto.DemandeAdoptionRequest;
import tn.enicarthage.shelter.dto.DemandeAdoptionResponse;
import tn.enicarthage.shelter.dto.DemandeStatutRequest;
import tn.enicarthage.shelter.exception.ResourceNotFoundException;
import tn.enicarthage.shelter.model.Animal;
import tn.enicarthage.shelter.model.DemandeAdoption;
import tn.enicarthage.shelter.model.StatutAnimal;
import tn.enicarthage.shelter.model.StatutDemande;
import tn.enicarthage.shelter.util.ValidationUtil;

public class DemandeAdoptionService {

    private final DemandeAdoptionDAO demandeDAO;
    private final AnimalDAO animalDAO;
    private final AdoptantDAO adoptantDAO;

    public DemandeAdoptionService() {
        this.demandeDAO = new DemandeAdoptionDAO();
        this.animalDAO = new AnimalDAO();
        this.adoptantDAO = new AdoptantDAO();
    }

    public List<DemandeAdoptionResponse> getAllDemandes() {
        List<DemandeAdoptionResponse> responses = new ArrayList<>();
        for (DemandeAdoption demande : demandeDAO.findAll()) {
            responses.add(DemandeAdoptionResponse.from(demande));
        }
        return responses;
    }

    public DemandeAdoptionResponse getDemandeById(int id) {
        return DemandeAdoptionResponse.from(findDemande(id));
    }

    public DemandeAdoptionResponse createDemande(DemandeAdoptionRequest request) {
        ValidationUtil.requirePositive(request.getAnimalId(), "L'animal est obligatoire.");
        ValidationUtil.requirePositive(request.getAdoptantId(), "L'adoptant est obligatoire.");

        Animal animal = animalDAO.findById(request.getAnimalId());
        if (animal == null) {
            throw new ResourceNotFoundException("Animal introuvable : " + request.getAnimalId());
        }

        if (adoptantDAO.findById(request.getAdoptantId()) == null) {
            throw new ResourceNotFoundException("Adoptant introuvable : " + request.getAdoptantId());
        }

        if (animal.getStatut() != StatutAnimal.DISPONIBLE) {
            throw new IllegalArgumentException("Cet animal n'est pas disponible pour l'adoption.");
        }

        DemandeAdoption demande = new DemandeAdoption();
        demande.setAnimalId(request.getAnimalId());
        demande.setAdoptantId(request.getAdoptantId());
        demande.setDateDemande(LocalDate.now());
        demande.setStatut(StatutDemande.EN_ATTENTE);
        demande.setMotif(request.getMotif());

        demandeDAO.create(demande);

        animal.setStatut(StatutAnimal.EN_ATTENTE_ADOPTION);
        animalDAO.update(animal);

        return DemandeAdoptionResponse.from(demande);
    }

    public DemandeAdoptionResponse updateStatut(int id, DemandeStatutRequest request) {
        DemandeAdoption demande = findDemande(id);
        ValidationUtil.requireNotNull(request.getStatut(), "Le statut est obligatoire.");

        demandeDAO.updateStatut(id, request.getStatut());
        demande.setStatut(request.getStatut());

        Animal animal = animalDAO.findById(demande.getAnimalId());
        if (animal != null) {
            if (request.getStatut() == StatutDemande.ACCEPTEE) {
                animal.setStatut(StatutAnimal.ADOPTE);
            } else if (request.getStatut() == StatutDemande.REFUSEE) {
                animal.setStatut(StatutAnimal.DISPONIBLE);
            } else {
                animal.setStatut(StatutAnimal.EN_ATTENTE_ADOPTION);
            }
            animalDAO.update(animal);
        }

        return DemandeAdoptionResponse.from(demande);
    }

    private DemandeAdoption findDemande(int id) {
        DemandeAdoption demande = demandeDAO.findById(id);
        if (demande == null) {
            throw new ResourceNotFoundException("Demande d'adoption introuvable : " + id);
        }
        return demande;
    }
}
