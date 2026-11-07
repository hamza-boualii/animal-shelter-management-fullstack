package tn.enicarthage.shelter.router;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import com.sun.net.httpserver.HttpExchange;

import tn.enicarthage.shelter.controller.AdoptantController;
import tn.enicarthage.shelter.controller.AnimalController;
import tn.enicarthage.shelter.controller.AuthController;
import tn.enicarthage.shelter.controller.DemandeAdoptionController;
import tn.enicarthage.shelter.controller.DonController;
import tn.enicarthage.shelter.controller.DossierMedicalController;
import tn.enicarthage.shelter.dto.AdoptantRequest;
import tn.enicarthage.shelter.dto.AnimalRequest;
import tn.enicarthage.shelter.dto.DemandeAdoptionRequest;
import tn.enicarthage.shelter.dto.DemandeStatutRequest;
import tn.enicarthage.shelter.dto.DonRequest;
import tn.enicarthage.shelter.dto.DossierMedicalRequest;
import tn.enicarthage.shelter.dto.LoginRequest;
import tn.enicarthage.shelter.exception.ResourceNotFoundException;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Router {

    private record Reponse(int statut, String corps) {
    }

    private record Erreur(String erreur) {
    }

    private final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class,
                    (JsonSerializer<LocalDate>) (src, type, ctx) -> new JsonPrimitive(src.toString()))
            .registerTypeAdapter(LocalDate.class,
                    (JsonDeserializer<LocalDate>) (json, type, ctx) ->
                            json.isJsonNull() ? null : LocalDate.parse(json.getAsString()))
            .registerTypeAdapter(LocalDateTime.class,
                    (JsonSerializer<LocalDateTime>) (src, type, ctx) -> new JsonPrimitive(src.toString()))
            .registerTypeAdapter(LocalDateTime.class,
                    (JsonDeserializer<LocalDateTime>) (json, type, ctx) ->
                            json.isJsonNull() ? null : LocalDateTime.parse(json.getAsString()))
            .create();

    private final AnimalController animalController = new AnimalController();
    private final AdoptantController adoptantController = new AdoptantController();
    private final AuthController authController = new AuthController();
    private final DemandeAdoptionController demandeAdoptionController = new DemandeAdoptionController();
    private final DossierMedicalController dossierMedicalController = new DossierMedicalController();
    private final DonController donController = new DonController();

    public void dispatcher(HttpExchange exchange) throws IOException {
        String methode = exchange.getRequestMethod();
        String[] segments = exchange.getRequestURI().getPath().split("/");

        try {
            Reponse reponse = router(methode, segments, exchange);
            envoyer(exchange, reponse.statut(), reponse.corps());
        } catch (ResourceNotFoundException e) {
            envoyer(exchange, 404, messageErreur(e));
        } catch (IllegalArgumentException e) {
            envoyer(exchange, 400, messageErreur(e));
        } catch (Exception e) {
            envoyer(exchange, 500, messageErreur(e));
        }
    }

    private Reponse router(String methode, String[] segments, HttpExchange exchange)
            throws IOException {
        if (segments.length < 2 || segments[1].isBlank()) {
            throw new ResourceNotFoundException("Route vide ou inconnue.");
        }

        switch (segments[1]) {
            case "animaux":
                return routesAnimaux(methode, segments, exchange);
            case "adoptants":
                return routesAdoptants(methode, segments, exchange);
            case "auth":
                return routesAuth(methode, segments, exchange);
            case "demandes":
                return routesDemandes(methode, segments, exchange);
            case "dossiers-medicaux":
                return routesDossiersMedicaux(methode, segments, exchange);
            case "dons":
                return routesDons(methode, segments, exchange);
            default:
                throw new ResourceNotFoundException("Route inconnue : /" + segments[1]);
        }
    }

    // ---------------------------------------------------------
    // Animaux
    // GET    /animaux
    // GET    /animaux/{id}
    // POST   /animaux
    // PUT    /animaux/{id}
    // DELETE /animaux/{id}
    // ---------------------------------------------------------
    private Reponse routesAnimaux(String methode, String[] segments, HttpExchange exchange)
            throws IOException {
        if (segments.length == 2) {
            switch (methode) {
                case "GET":
                    return new Reponse(200, gson.toJson(animalController.lister()));
                case "POST": {
                    AnimalRequest request = lireCorps(exchange, AnimalRequest.class);
                    return new Reponse(201, gson.toJson(animalController.creer(request)));
                }
                default:
                    throw new IllegalArgumentException("Methode non supportee : " + methode + " /animaux");
            }
        }

        if (segments.length == 3) {
            int id = entier(segments[2]);
            switch (methode) {
                case "GET":
                    return new Reponse(200, gson.toJson(animalController.obtenir(id)));
                case "PUT": {
                    AnimalRequest request = lireCorps(exchange, AnimalRequest.class);
                    return new Reponse(200, gson.toJson(animalController.modifier(id, request)));
                }
                case "DELETE":
                    animalController.supprimer(id);
                    return new Reponse(204, "");
                default:
                    throw new IllegalArgumentException("Methode non supportee : " + methode
                            + " /animaux/{id}");
            }
        }

        throw new ResourceNotFoundException("Route inconnue : /" + String.join("/", segments));
    }

    // ---------------------------------------------------------
    // Adoptants
    // POST /adoptants
    // ---------------------------------------------------------
    private Reponse routesAdoptants(String methode, String[] segments, HttpExchange exchange)
            throws IOException {
        if (segments.length == 2) {
            switch (methode) {
                case "POST": {
                    AdoptantRequest request = lireCorps(exchange, AdoptantRequest.class);
                    return new Reponse(201, gson.toJson(adoptantController.creer(request)));
                }
                default:
                    throw new IllegalArgumentException("Methode non supportee : " + methode
                            + " /adoptants");
            }
        }

        throw new ResourceNotFoundException("Route inconnue : /" + String.join("/", segments));
    }

    // ---------------------------------------------------------
    // Authentification
    // POST /auth/adoptants/login
    // POST /auth/personnels/login
    // ---------------------------------------------------------
    private Reponse routesAuth(String methode, String[] segments, HttpExchange exchange)
            throws IOException {
        if (segments.length == 4 && "login".equals(segments[3])) {
            if (!"POST".equals(methode)) {
                throw new IllegalArgumentException("Methode non supportee : " + methode
                        + " /auth/" + segments[2] + "/login");
            }

            LoginRequest request = lireCorps(exchange, LoginRequest.class);

            if ("adoptants".equals(segments[2])) {
                return new Reponse(200, gson.toJson(authController.connecterAdoptant(request)));
            }
            if ("personnels".equals(segments[2])) {
                return new Reponse(200, gson.toJson(authController.connecterPersonnel(request)));
            }
        }

        throw new ResourceNotFoundException("Route inconnue : /" + String.join("/", segments));
    }

    // ---------------------------------------------------------
    // Demandes d'adoption
    // GET  /demandes
    // GET  /demandes/{id}
    // POST /demandes
    // PUT  /demandes/{id}
    // ---------------------------------------------------------
    private Reponse routesDemandes(String methode, String[] segments, HttpExchange exchange)
            throws IOException {
        if (segments.length == 2) {
            switch (methode) {
                case "GET":
                    return new Reponse(200, gson.toJson(demandeAdoptionController.lister()));
                case "POST": {
                    DemandeAdoptionRequest request = lireCorps(exchange, DemandeAdoptionRequest.class);
                    return new Reponse(201, gson.toJson(demandeAdoptionController.creer(request)));
                }
                default:
                    throw new IllegalArgumentException("Methode non supportee : " + methode
                            + " /demandes");
            }
        }

        if (segments.length == 3) {
            int id = entier(segments[2]);
            switch (methode) {
                case "GET":
                    return new Reponse(200, gson.toJson(demandeAdoptionController.obtenir(id)));
                case "PUT": {
                    DemandeStatutRequest request = lireCorps(exchange, DemandeStatutRequest.class);
                    return new Reponse(200, gson.toJson(
                            demandeAdoptionController.modifierStatut(id, request)));
                }
                default:
                    throw new IllegalArgumentException("Methode non supportee : " + methode
                            + " /demandes/{id}");
            }
        }

        throw new ResourceNotFoundException("Route inconnue : /" + String.join("/", segments));
    }

    // ---------------------------------------------------------
    // Dossiers medicaux
    // GET    /dossiers-medicaux
    // GET    /dossiers-medicaux/{id}
    // POST   /dossiers-medicaux
    // PUT    /dossiers-medicaux/{id}
    // DELETE /dossiers-medicaux/{id}
    // ---------------------------------------------------------
    private Reponse routesDossiersMedicaux(String methode, String[] segments, HttpExchange exchange)
            throws IOException {
        if (segments.length == 2) {
            switch (methode) {
                case "GET":
                    return new Reponse(200, gson.toJson(dossierMedicalController.lister()));
                case "POST": {
                    DossierMedicalRequest request = lireCorps(exchange, DossierMedicalRequest.class);
                    return new Reponse(201, gson.toJson(dossierMedicalController.creer(request)));
                }
                default:
                    throw new IllegalArgumentException("Methode non supportee : " + methode
                            + " /dossiers-medicaux");
            }
        }

        if (segments.length == 3) {
            int id = entier(segments[2]);
            switch (methode) {
                case "GET":
                    return new Reponse(200, gson.toJson(dossierMedicalController.obtenir(id)));
                case "PUT": {
                    DossierMedicalRequest request = lireCorps(exchange, DossierMedicalRequest.class);
                    return new Reponse(200, gson.toJson(
                            dossierMedicalController.modifier(id, request)));
                }
                case "DELETE":
                    dossierMedicalController.supprimer(id);
                    return new Reponse(204, "");
                default:
                    throw new IllegalArgumentException("Methode non supportee : " + methode
                            + " /dossiers-medicaux/{id}");
            }
        }

        throw new ResourceNotFoundException("Route inconnue : /" + String.join("/", segments));
    }

    // ---------------------------------------------------------
    // Dons
    // GET    /dons
    // GET    /dons/{id}
    // POST   /dons
    // PUT    /dons/{id}
    // DELETE /dons/{id}
    // ---------------------------------------------------------
    private Reponse routesDons(String methode, String[] segments, HttpExchange exchange)
            throws IOException {
        if (segments.length == 2) {
            switch (methode) {
                case "GET":
                    return new Reponse(200, gson.toJson(donController.lister()));
                case "POST": {
                    DonRequest request = lireCorps(exchange, DonRequest.class);
                    return new Reponse(201, gson.toJson(donController.creer(request)));
                }
                default:
                    throw new IllegalArgumentException("Methode non supportee : " + methode + " /dons");
            }
        }

        if (segments.length == 3) {
            int id = entier(segments[2]);
            switch (methode) {
                case "GET":
                    return new Reponse(200, gson.toJson(donController.obtenir(id)));
                case "PUT": {
                    DonRequest request = lireCorps(exchange, DonRequest.class);
                    return new Reponse(200, gson.toJson(donController.modifier(id, request)));
                }
                case "DELETE":
                    donController.supprimer(id);
                    return new Reponse(204, "");
                default:
                    throw new IllegalArgumentException("Methode non supportee : " + methode
                            + " /dons/{id}");
            }
        }

        throw new ResourceNotFoundException("Route inconnue : /" + String.join("/", segments));
    }

    private <T> T lireCorps(HttpExchange exchange, Class<T> type) throws IOException {
        try (InputStream input = exchange.getRequestBody()) {
            String corps = new String(input.readAllBytes(), StandardCharsets.UTF_8);
            if (corps.isBlank()) {
                throw new IllegalArgumentException("Le corps JSON est obligatoire.");
            }
            try {
                T objet = gson.fromJson(corps, type);
                if (objet == null) {
                    throw new IllegalArgumentException("Le corps JSON est invalide.");
                }
                return objet;
            } catch (JsonParseException e) {
                throw new IllegalArgumentException("JSON invalide : " + e.getMessage());
            }
        }
    }

    private int entier(String valeur) {
        try {
            return Integer.parseInt(valeur);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Identifiant invalide : " + valeur);
        }
    }

    private String messageErreur(Exception e) {
        String message = e.getMessage() == null ? "Erreur interne du serveur." : e.getMessage();
        return gson.toJson(new Erreur(message));
    }

    private void envoyer(HttpExchange exchange, int statut, String corps) throws IOException {
        byte[] bytes = corps == null ? new byte[0] : corps.getBytes(StandardCharsets.UTF_8);
        if (bytes.length > 0) {
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            exchange.sendResponseHeaders(statut, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        } else {
            exchange.sendResponseHeaders(statut, -1);
            exchange.close();
        }
    }
}
