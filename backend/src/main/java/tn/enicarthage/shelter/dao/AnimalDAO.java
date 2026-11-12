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
import tn.enicarthage.shelter.model.Animal;
import tn.enicarthage.shelter.model.Espece;
import tn.enicarthage.shelter.model.Sexe;
import tn.enicarthage.shelter.model.StatutAnimal;

public class AnimalDAO {

    public void create(Animal animal) {
        String sql = "INSERT INTO animal (personnel_id, nom, espece, race, sexe, age, poids, "
                + "description, photo_url, statut, date_arrivee) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            remplir(statement, animal);
            statement.executeUpdate();

            try (ResultSet keys = statement.getGeneratedKeys()) {
                if (keys.next()) {
                    animal.setId(keys.getInt(1));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la creation de l'animal.", e);
        }
    }

    public List<Animal> findAll() {
        List<Animal> animaux = new ArrayList<>();
        String sql = "SELECT * FROM animal ORDER BY id";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet result = statement.executeQuery()) {

            while (result.next()) {
                animaux.add(mapper(result));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la lecture des animaux.", e);
        }

        return animaux;
    }

    public Animal findById(int id) {
        String sql = "SELECT * FROM animal WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);

            try (ResultSet result = statement.executeQuery()) {
                if (result.next()) {
                    return mapper(result);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la recherche de l'animal.", e);
        }

        return null;
    }

    public void update(Animal animal) {
        String sql = "UPDATE animal SET personnel_id = ?, nom = ?, espece = ?, race = ?, "
                + "sexe = ?, age = ?, poids = ?, description = ?, photo_url = ?, statut = ?, "
                + "date_arrivee = ? WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            remplir(statement, animal);
            statement.setInt(12, animal.getId());
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la modification de l'animal.", e);
        }
    }

    public void delete(int id) {
        String sql = "DELETE FROM animal WHERE id = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la suppression de l'animal.", e);
        }
    }

    private void remplir(PreparedStatement statement, Animal animal) throws SQLException {
        statement.setInt(1, animal.getPersonnelId());
        statement.setString(2, animal.getNom());
        statement.setString(3, animal.getEspece().name());
        statement.setString(4, animal.getRace());
        statement.setString(5, animal.getSexe().name());
        statement.setInt(6, animal.getAge());
        statement.setBigDecimal(7, animal.getPoids());
        statement.setString(8, animal.getDescription());
        statement.setString(9, animal.getPhotoUrl());
        statement.setString(10, animal.getStatut().name());
        statement.setObject(11, animal.getDateArrivee());
    }

    private Animal mapper(ResultSet result) throws SQLException {
        Animal animal = new Animal();
        animal.setId(result.getInt("id"));
        animal.setPersonnelId(result.getInt("personnel_id"));
        animal.setNom(result.getString("nom"));
        animal.setEspece(Espece.valueOf(result.getString("espece")));
        animal.setRace(result.getString("race"));
        animal.setSexe(Sexe.valueOf(result.getString("sexe")));
        animal.setAge(result.getInt("age"));
        animal.setPoids(result.getBigDecimal("poids"));
        animal.setDescription(result.getString("description"));
        animal.setPhotoUrl(result.getString("photo_url"));
        animal.setStatut(StatutAnimal.valueOf(result.getString("statut")));

        LocalDate dateArrivee = result.getObject("date_arrivee", LocalDate.class);
        animal.setDateArrivee(dateArrivee);

        return animal;
    }
}
