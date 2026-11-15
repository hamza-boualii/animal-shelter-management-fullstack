package tn.enicarthage.shelter.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import tn.enicarthage.shelter.config.UploadConfig;

public class ImageUploadService {

    public static final long MAX_FILE_SIZE = 5L * 1024L * 1024L;

    public String enregistrerImageAnimal(byte[] bytes) {
        if (bytes == null || bytes.length == 0) {
            throw new IllegalArgumentException("Le fichier image est vide.");
        }

        if (bytes.length > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("La taille du fichier depasse la limite autorisee de 5 Mo.");
        }

        String extension = detecterFormat(bytes);
        if (extension == null) {
            throw new IllegalArgumentException("Format d'image non supporte. Formats acceptes : JPG, PNG, WebP.");
        }

        String nomFichier = UUID.randomUUID().toString() + "." + extension;
        Path destination = UploadConfig.getAnimalsUploadDir().resolve(nomFichier).normalize();

        try {
            Files.write(destination, bytes);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'enregistrement de l'image sur le serveur.", e);
        }

        return "/uploads/animals/" + nomFichier;
    }

    public static String detecterFormat(byte[] bytes) {
        if (bytes == null || bytes.length < 12) {
            return null;
        }

        if ((bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF) {
            return "jpg";
        }

        if (bytes.length >= 8 &&
                (bytes[0] & 0xFF) == 0x89 &&
                (bytes[1] & 0xFF) == 0x50 &&
                (bytes[2] & 0xFF) == 0x4E &&
                (bytes[3] & 0xFF) == 0x47 &&
                (bytes[4] & 0xFF) == 0x0D &&
                (bytes[5] & 0xFF) == 0x0A &&
                (bytes[6] & 0xFF) == 0x1A &&
                (bytes[7] & 0xFF) == 0x0A) {
            return "png";
        }

        if (bytes[0] == 'R' && bytes[1] == 'I' && bytes[2] == 'F' && bytes[3] == 'F' &&
                bytes[8] == 'W' && bytes[9] == 'E' && bytes[10] == 'B' && bytes[11] == 'P') {
            return "webp";
        }

        return null;
    }

    public static String getMimeType(String nomFichier) {
        if (nomFichier == null) {
            return "application/octet-stream";
        }
        String lower = nomFichier.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return "image/jpeg";
        }
        if (lower.endsWith(".png")) {
            return "image/png";
        }
        if (lower.endsWith(".webp")) {
            return "image/webp";
        }
        return "application/octet-stream";
    }
}
