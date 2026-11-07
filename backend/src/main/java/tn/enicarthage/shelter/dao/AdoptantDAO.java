package tn.enicarthage.shelter.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import tn.enicarthage.shelter.config.DatabaseConnection;
import tn.enicarthage.shelter.model.Adoptant;

public class AdoptantDAO {

    public void create(Adoptant adoptant) {
        String sql = "INSERT INTO adoptant (nom, prenom, email, mot_de_passe, telephone) "
                + "VALUES (?, ?, ?, ?, ?)";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            statement.setString(1, adoptant.getNom());
            statement.setString(2, adoptant.getPrenom());
            statement.setString(3, adoptant.getEmail());
            statement.setString(4, adoptant.getMotDePasse());
            statement.setString(5, adoptant.getTelephone());

            statement.executeUpdate();

            try (ResultSet keys = statement.getGeneratedKeys()) {
                if (keys.next()) {
                    adoptant.setId(keys.getInt(1));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la creation de l'adoptant.", e);
        }
    }

    public Adoptant findById(int id) {
        String sql = "SELECT * FROM adoptant WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            try (ResultSet result = statement.executeQuery()) {
                if (result.next()) {
                    return mapper(result);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la recherche de l'adoptant.", e);
        }

        return null;
    }

    public Adoptant findByEmail(String email) {
        String sql = "SELECT * FROM adoptant WHERE email = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, email);

            try (ResultSet result = statement.executeQuery()) {
                if (result.next()) {
                    return mapper(result);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la recherche de l'adoptant.", e);
        }

        return null;
    }

    private Adoptant mapper(ResultSet result) throws SQLException {
        Adoptant adoptant = new Adoptant();
        adoptant.setId(result.getInt("id"));
        adoptant.setNom(result.getString("nom"));
        adoptant.setPrenom(result.getString("prenom"));
        adoptant.setEmail(result.getString("email"));
        adoptant.setMotDePasse(result.getString("mot_de_passe"));
        adoptant.setTelephone(result.getString("telephone"));
        return adoptant;
    }
}
