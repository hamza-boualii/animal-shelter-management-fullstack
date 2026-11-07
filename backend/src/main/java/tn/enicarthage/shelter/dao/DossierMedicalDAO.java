package tn.enicarthage.shelter.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import tn.enicarthage.shelter.config.DatabaseConnection;
import tn.enicarthage.shelter.model.DossierMedical;

public class DossierMedicalDAO {

    public void create(DossierMedical dossier) {
        String sql = "INSERT INTO dossier_medical (animal_id, personnel_id, sterilise, allergies, "
                + "vaccins_recus, traitements_en_cours, description, photo_urls) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            remplir(statement, dossier);
            statement.executeUpdate();

            try (ResultSet keys = statement.getGeneratedKeys()) {
                if (keys.next()) {
                    dossier.setId(keys.getInt(1));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la creation du dossier medical.", e);
        }
    }

    public List<DossierMedical> findAll() {
        List<DossierMedical> dossiers = new ArrayList<>();
        String sql = "SELECT * FROM dossier_medical ORDER BY id";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet result = statement.executeQuery()) {

            while (result.next()) {
                dossiers.add(mapper(result));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la lecture des dossiers medicaux.", e);
        }

        return dossiers;
    }

    public DossierMedical findById(int id) {
        String sql = "SELECT * FROM dossier_medical WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            try (ResultSet result = statement.executeQuery()) {
                if (result.next()) {
                    return mapper(result);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la recherche du dossier medical.", e);
        }

        return null;
    }

    public void update(DossierMedical dossier) {
        String sql = "UPDATE dossier_medical SET animal_id = ?, personnel_id = ?, sterilise = ?, "
                + "allergies = ?, vaccins_recus = ?, traitements_en_cours = ?, description = ?, "
                + "photo_urls = ? WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            remplir(statement, dossier);
            statement.setInt(9, dossier.getId());
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la modification du dossier medical.", e);
        }
    }

    public void delete(int id) {
        String sql = "DELETE FROM dossier_medical WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la suppression du dossier medical.", e);
        }
    }

    private void remplir(PreparedStatement statement, DossierMedical dossier) throws SQLException {
        statement.setInt(1, dossier.getAnimalId());
        statement.setInt(2, dossier.getPersonnelId());
        statement.setBoolean(3, dossier.isSterilise());
        statement.setString(4, dossier.getAllergies());
        statement.setString(5, dossier.getVaccinsRecus());
        statement.setString(6, dossier.getTraitementsEnCours());
        statement.setString(7, dossier.getDescription());
        statement.setString(8, dossier.getPhotoUrls());
    }

    private DossierMedical mapper(ResultSet result) throws SQLException {
        DossierMedical dossier = new DossierMedical();
        dossier.setId(result.getInt("id"));
        dossier.setAnimalId(result.getInt("animal_id"));
        dossier.setPersonnelId(result.getInt("personnel_id"));
        dossier.setSterilise(result.getBoolean("sterilise"));
        dossier.setAllergies(result.getString("allergies"));
        dossier.setVaccinsRecus(result.getString("vaccins_recus"));
        dossier.setTraitementsEnCours(result.getString("traitements_en_cours"));
        dossier.setDescription(result.getString("description"));
        dossier.setPhotoUrls(result.getString("photo_urls"));
        return dossier;
    }
}
