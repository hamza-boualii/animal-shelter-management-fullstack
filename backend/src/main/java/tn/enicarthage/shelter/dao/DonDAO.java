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
import tn.enicarthage.shelter.model.Don;
import tn.enicarthage.shelter.model.TypeDon;

public class DonDAO {

    public void create(Don don) {
        String sql = "INSERT INTO don (personnel_id, type_don, valeur, description, date_don, "
                + "nom_donateur, telephone_donateur, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            remplir(statement, don);
            statement.executeUpdate();

            try (ResultSet keys = statement.getGeneratedKeys()) {
                if (keys.next()) {
                    don.setId(keys.getInt(1));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la creation du don.", e);
        }
    }

    public List<Don> findAll() {
        List<Don> dons = new ArrayList<>();
        String sql = "SELECT * FROM don ORDER BY id";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet result = statement.executeQuery()) {

            while (result.next()) {
                dons.add(mapper(result));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la lecture des dons.", e);
        }

        return dons;
    }

    public Don findById(int id) {
        String sql = "SELECT * FROM don WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            try (ResultSet result = statement.executeQuery()) {
                if (result.next()) {
                    return mapper(result);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la recherche du don.", e);
        }

        return null;
    }

    public void update(Don don) {
        String sql = "UPDATE don SET personnel_id = ?, type_don = ?, valeur = ?, description = ?, "
                + "date_don = ?, nom_donateur = ?, telephone_donateur = ?, photo_url = ? WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            remplir(statement, don);
            statement.setInt(9, don.getId());
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la modification du don.", e);
        }
    }

    public void delete(int id) {
        String sql = "DELETE FROM don WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la suppression du don.", e);
        }
    }

    private void remplir(PreparedStatement statement, Don don) throws SQLException {
        statement.setInt(1, don.getPersonnelId());
        statement.setString(2, don.getTypeDon().name());
        statement.setBigDecimal(3, don.getValeur());
        statement.setString(4, don.getDescription());
        statement.setObject(5, don.getDate());
        statement.setString(6, don.getNomDonateur());
        statement.setString(7, don.getTelephoneDonateur());
        statement.setString(8, don.getPhotoUrl());
    }

    private Don mapper(ResultSet result) throws SQLException {
        Don don = new Don();
        don.setId(result.getInt("id"));
        don.setPersonnelId(result.getInt("personnel_id"));
        don.setTypeDon(TypeDon.valueOf(result.getString("type_don")));
        don.setValeur(result.getBigDecimal("valeur"));
        don.setDescription(result.getString("description"));

        LocalDate date = result.getObject("date_don", LocalDate.class);
        don.setDate(date);

        don.setNomDonateur(result.getString("nom_donateur"));
        don.setTelephoneDonateur(result.getString("telephone_donateur"));
        don.setPhotoUrl(result.getString("photo_url"));
        return don;
    }
}
