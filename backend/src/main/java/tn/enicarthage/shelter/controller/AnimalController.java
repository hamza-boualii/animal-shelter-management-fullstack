package tn.enicarthage.shelter.controller;

import java.util.List;

import tn.enicarthage.shelter.dto.AnimalRequest;
import tn.enicarthage.shelter.dto.AnimalResponse;
import tn.enicarthage.shelter.service.AnimalService;

public class AnimalController {

    private final AnimalService animalService;

    public AnimalController() {
        this.animalService = new AnimalService();
    }

    public List<AnimalResponse> lister() {
        return animalService.getAllAnimaux();
    }

    public AnimalResponse obtenir(int id) {
        return animalService.getAnimalById(id);
    }

    public AnimalResponse creer(AnimalRequest request) {
        return animalService.createAnimal(request);
    }

    public AnimalResponse modifier(int id, AnimalRequest request) {
        return animalService.updateAnimal(id, request);
    }

    public void supprimer(int id) {
        animalService.deleteAnimal(id);
    }
}
