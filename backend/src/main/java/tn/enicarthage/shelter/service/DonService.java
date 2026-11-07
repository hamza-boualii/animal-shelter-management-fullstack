package tn.enicarthage.shelter.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import tn.enicarthage.shelter.dao.DonDAO;
import tn.enicarthage.shelter.dao.PersonnelDAO;
import tn.enicarthage.shelter.dto.DonRequest;
import tn.enicarthage.shelter.dto.DonResponse;
import tn.enicarthage.shelter.exception.ResourceNotFoundException;
import tn.enicarthage.shelter.model.Don;
import tn.enicarthage.shelter.model.TypeDon;
import tn.enicarthage.shelter.util.ValidationUtil;

public class DonService {

    private final DonDAO donDAO;
    private final PersonnelDAO personnelDAO;

    public DonService() {
        this.donDAO = new DonDAO();
        this.personnelDAO = new PersonnelDAO();
    }

    public List<DonResponse> getAllDons() {
        List<DonResponse> responses = new ArrayList<>();
        for (Don don : donDAO.findAll()) {
            responses.add(DonResponse.from(don));
        }
        return responses;
    }

    public DonResponse getDonById(int id) {
        return DonResponse.from(findDon(id));
    }

    public DonResponse createDon(DonRequest request) {
        valider(request);
        verifierPersonnel(request.getPersonnelId());

        Don don = construire(request);
        don.setDate(request.getDate() == null ? LocalDate.now() : request.getDate());

        donDAO.create(don);
        return DonResponse.from(don);
    }

    public DonResponse updateDon(int id, DonRequest request) {
        Don existant = findDon(id);
        valider(request);
        verifierPersonnel(request.getPersonnelId());

        Don don = construire(request);
        don.setId(existant.getId());
        don.setDate(request.getDate() == null ? existant.getDate() : request.getDate());

        donDAO.update(don);
        return DonResponse.from(don);
    }

    public void deleteDon(int id) {
        findDon(id);
        donDAO.delete(id);
    }

    private Don findDon(int id) {
        Don don = donDAO.findById(id);
        if (don == null) {
            throw new ResourceNotFoundException("Don introuvable : " + id);
        }
        return don;
    }

    private void valider(DonRequest request) {
        ValidationUtil.requirePositive(request.getPersonnelId(), "Le personnel est obligatoire.");
        ValidationUtil.requireNotNull(request.getTypeDon(), "Le type de don est obligatoire.");

        if (request.getValeur() != null
                && request.getValeur().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("La valeur du don doit etre positive.");
        }

        if (request.getTypeDon() == TypeDon.ARGENT && request.getValeur() == null) {
            throw new IllegalArgumentException("La valeur est obligatoire pour un don en argent.");
        }
    }

    private void verifierPersonnel(int personnelId) {
        if (personnelDAO.findById(personnelId) == null) {
            throw new ResourceNotFoundException("Personnel introuvable : " + personnelId);
        }
    }

    private Don construire(DonRequest request) {
        Don don = new Don();
        don.setPersonnelId(request.getPersonnelId());
        don.setTypeDon(request.getTypeDon());
        don.setValeur(request.getValeur());
        don.setDescription(request.getDescription());
        don.setNomDonateur(request.getNomDonateur());
        don.setTelephoneDonateur(request.getTelephoneDonateur());
        don.setPhotoUrl(request.getPhotoUrl());
        return don;
    }
}
