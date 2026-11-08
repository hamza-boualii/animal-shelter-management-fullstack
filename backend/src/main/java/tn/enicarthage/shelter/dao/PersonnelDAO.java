package tn.enicarthage.shelter.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import tn.enicarthage.shelter.config.DatabaseConnection;
import tn.enicarthage.shelter.model.Personnel;

public class PersonnelDAO {

    public Personnel findById(int id) {
        String sql = "SELECT * FROM personnel WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            try (ResultSet result = statement.executeQuery()) {
                if (result.next()) {
                    return mapper(result);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la recherche du personnel.", e);
        }

        return null;
    }

    public Personnel findByUsername(String username) {
        String sql = "SELECT * FROM personnel WHERE username = ? OR email = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setString(1, username);
            statement.setString(2, username);

            try (ResultSet result = statement.executeQuery()) {
                if (result.next()) {
                    return mapper(result);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la recherche du personnel.", e);
        }

        return null;
    }

    private Personnel mapper(ResultSet result) throws SQLException {
        Personnel personnel = new Personnel();
        personnel.setId(result.getInt("id"));
        personnel.setUsername(result.getString("username"));
        personnel.setEmail(result.getString("email"));
        personnel.setMotDePasse(result.getString("mot_de_passe"));
        return personnel;
    }
}
