package tn.enicarthage.shelter.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import tn.enicarthage.shelter.config.DatabaseConnection;
import tn.enicarthage.shelter.model.DemandeAdoption;
import tn.enicarthage.shelter.model.StatutDemande;

public class DemandeAdoptionDAO {

    public void create(DemandeAdoption demande) {
        String sql = "INSERT INTO demande_adoption (animal_id, adoptant_id, date_demande, statut, motif) "
                + "VALUES (?, ?, ?, ?, ?)";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            statement.setInt(1, demande.getAnimalId());
            statement.setInt(2, demande.getAdoptantId());
            statement.setObject(3, demande.getDateDemande());
            statement.setString(4, demande.getStatut().name());
            statement.setString(5, demande.getMotif());

            statement.executeUpdate();

            try (ResultSet keys = statement.getGeneratedKeys()) {
                if (keys.next()) {
                    demande.setId(keys.getInt(1));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la creation de la demande d'adoption.", e);
        }
    }

    public List<DemandeAdoption> findAll() {
        List<DemandeAdoption> demandes = new ArrayList<>();
        String sql = "SELECT * FROM demande_adoption ORDER BY id";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet result = statement.executeQuery()) {

            while (result.next()) {
                demandes.add(mapper(result));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la lecture des demandes d'adoption.", e);
        }

        return demandes;
    }

    public DemandeAdoption findById(int id) {
        String sql = "SELECT * FROM demande_adoption WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            try (ResultSet result = statement.executeQuery()) {
                if (result.next()) {
                    return mapper(result);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la recherche de la demande d'adoption.", e);
        }

        return null;
    }

    public void updateStatut(int id, StatutDemande statut) {
        String sql = "UPDATE demande_adoption SET statut = ? WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, statut.name());
            statement.setInt(2, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la modification de la demande d'adoption.", e);
        }
    }

    private DemandeAdoption mapper(ResultSet result) throws SQLException {
        DemandeAdoption demande = new DemandeAdoption();
        demande.setId(result.getInt("id"));
        demande.setAnimalId(result.getInt("animal_id"));
        demande.setAdoptantId(result.getInt("adoptant_id"));

        LocalDate dateDemande = result.getObject("date_demande", LocalDate.class);
        demande.setDateDemande(dateDemande);

        demande.setStatut(StatutDemande.valueOf(result.getString("statut")));
        demande.setMotif(result.getString("motif"));
        return demande;
    }
}
