package tn.enicarthage.shelter.service;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import tn.enicarthage.shelter.config.UploadConfig;
import tn.enicarthage.shelter.dao.AnimalDAO;
import tn.enicarthage.shelter.dao.PersonnelDAO;
import tn.enicarthage.shelter.dto.AnimalRequest;
import tn.enicarthage.shelter.dto.AnimalResponse;
import tn.enicarthage.shelter.exception.ResourceNotFoundException;
import tn.enicarthage.shelter.model.Animal;
import tn.enicarthage.shelter.model.StatutAnimal;
import tn.enicarthage.shelter.util.ValidationUtil;

public class AnimalService {

    private final AnimalDAO animalDAO;
    private final PersonnelDAO personnelDAO;

    public AnimalService() {
        this.animalDAO = new AnimalDAO();
        this.personnelDAO = new PersonnelDAO();
    }

    public List<AnimalResponse> getAllAnimaux() {
        List<AnimalResponse> responses = new ArrayList<>();
        for (Animal animal : animalDAO.findAll()) {
            responses.add(AnimalResponse.from(animal));
        }
        return responses;
    }

    public AnimalResponse getAnimalById(int id) {
        return AnimalResponse.from(findAnimal(id));
    }

    public AnimalResponse createAnimal(AnimalRequest request) {
        valider(request);
        String photoUrl = request.getPhotoUrl() == null ? null : request.getPhotoUrl().trim();
        validerPhoto(photoUrl);
        verifierPersonnel(request.getPersonnelId());

        Animal animal = construire(request);
        animal.setPhotoUrl(photoUrl);
        animal.setStatut(request.getStatut() == null ? StatutAnimal.DISPONIBLE : request.getStatut());
        animal.setDateArrivee(request.getDateArrivee() == null ? LocalDate.now() : request.getDateArrivee());

        animalDAO.create(animal);
        return AnimalResponse.from(animal);
    }

    public AnimalResponse updateAnimal(int id, AnimalRequest request) {
        Animal existant = findAnimal(id);
        valider(request);
        verifierPersonnel(request.getPersonnelId());

        String photoUrl = request.getPhotoUrl() == null || request.getPhotoUrl().isBlank()
                ? existant.getPhotoUrl()
                : request.getPhotoUrl().trim();
        validerPhoto(photoUrl);

        Animal animal = construire(request);
        animal.setPhotoUrl(photoUrl);
        animal.setId(existant.getId());
        animal.setStatut(request.getStatut() == null ? existant.getStatut() : request.getStatut());
        animal.setDateArrivee(request.getDateArrivee() == null
                ? existant.getDateArrivee()
                : request.getDateArrivee());

        animalDAO.update(animal);
        return AnimalResponse.from(animal);
    }

    public void deleteAnimal(int id) {
        findAnimal(id);
        animalDAO.delete(id);
    }

    private Animal findAnimal(int id) {
        Animal animal = animalDAO.findById(id);
        if (animal == null) {
            throw new ResourceNotFoundException("Animal introuvable : " + id);
        }
        return animal;
    }

    private void valider(AnimalRequest request) {
        ValidationUtil.requirePositive(request.getPersonnelId(), "Le personnel est obligatoire.");
        ValidationUtil.requireText(request.getNom(), "Le nom de l'animal est obligatoire.");
        ValidationUtil.requireNotNull(request.getEspece(), "L'espece est obligatoire.");
        ValidationUtil.requireNotNull(request.getSexe(), "Le sexe est obligatoire.");
        ValidationUtil.requireNonNegative(request.getAge(), "L'age doit etre positif ou nul.");
        ValidationUtil.requireNotNull(request.getPoids(), "Le poids est obligatoire.");
        ValidationUtil.requirePositive(request.getPoids(), "Le poids doit etre strictement positif.");
        ValidationUtil.requireMaxScale(request.getPoids(), 2,
                "Le poids ne peut pas depasser deux decimales.");
        ValidationUtil.requireAtMost(request.getPoids(), new BigDecimal("9999.99"),
                "Le poids depasse la capacite maximale autorisee.");
    }

    private void validerPhoto(String photoUrl) {
        ValidationUtil.requireText(photoUrl, "La photo de l'animal est obligatoire.");
        String prefixe = "/uploads/animals/";
        if (!photoUrl.startsWith(prefixe)) {
            throw new IllegalArgumentException(
                    "La photo de l'animal doit etre une image televersee.");
        }
        String nomFichier = photoUrl.substring(prefixe.length());
        if (nomFichier.isBlank() || nomFichier.contains("/") || nomFichier.contains("\\")
                || nomFichier.contains("..")) {
            throw new IllegalArgumentException("La photo de l'animal est invalide.");
        }
        Path fichier = UploadConfig.getAnimalsUploadDir().resolve(nomFichier).normalize();
        if (!Files.isRegularFile(fichier)) {
            throw new IllegalArgumentException(
                    "Le fichier de la photo de l'animal est introuvable.");
        }
    }

    private void verifierPersonnel(int personnelId) {
        if (personnelDAO.findById(personnelId) == null) {
            throw new ResourceNotFoundException("Personnel introuvable : " + personnelId);
        }
    }

    private Animal construire(AnimalRequest request) {
        Animal animal = new Animal();
        animal.setPersonnelId(request.getPersonnelId());
        animal.setNom(request.getNom());
        animal.setEspece(request.getEspece());
        animal.setRace(request.getRace());
        animal.setSexe(request.getSexe());
        animal.setAge(request.getAge());
        animal.setPoids(request.getPoids());
        animal.setDescription(request.getDescription());
        animal.setPhotoUrl(request.getPhotoUrl());
        return animal;
    }
}
