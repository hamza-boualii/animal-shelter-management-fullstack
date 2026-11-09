package tn.enicarthage.shelter.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public final class DatabaseConnection {

    private static final String HOST = "localhost";
    private static final int PORT = 3306;
    private static final String DATABASE = "shelter";
    private static final String USER = "root";
    private static final String PASSWORD = "";
    private static final String OPTIONS =
            "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
                    + "&allowMultiQueries=true";
    private static final String URL = "jdbc:mysql://" + HOST + ":" + PORT + "/" + DATABASE + OPTIONS;
    private static final String SERVER_URL = "jdbc:mysql://" + HOST + ":" + PORT + "/" + OPTIONS;
    private static final String DATABASE_SCRIPT_NAME = "database.sql";
    private static final String DATABASE_SCRIPT_PROPERTY = "shelter.database.script";

    private DatabaseConnection() {
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public static void main(String[] args) {

        Path databaseScript = resolveDatabaseScript();

        if (!Files.isRegularFile(databaseScript)) {
            System.err.println("Script SQL introuvable : " + databaseScript.toAbsolutePath());
            System.exit(1);
        }

        try {
            initializeDatabase(Files.readString(databaseScript, StandardCharsets.UTF_8));
            System.out.println("DB + tables creees avec succes.");
        } catch (IOException | SQLException e) {
            System.err.println("Erreur d'initialisation de la base : " + e.getMessage());
            System.exit(1);
        }
    }

    /**
     * The only source copy of the schema is {@code <project-root>/database/database.sql}.
     * Walk up from the working directory and from the compiled classes/JAR so the
     * initializer works whether it is launched from the project root, from backend/,
     * or from an IDE. It can be overridden with -Dshelter.database.script=...
     */
    private static Path resolveDatabaseScript() {
        String override = System.getProperty(DATABASE_SCRIPT_PROPERTY);
        if (override != null && !override.isBlank()) {
            return Paths.get(override).toAbsolutePath();
        }

        Path workingDir = Paths.get("").toAbsolutePath();
        Path fromWorkingDir = findDatabaseScript(workingDir);
        if (fromWorkingDir != null) {
            return fromWorkingDir;
        }

        try {
            Path codeSource = Paths.get(DatabaseConnection.class.getProtectionDomain()
                    .getCodeSource().getLocation().toURI());
            Path fromCodeSource = findDatabaseScript(codeSource.toAbsolutePath());
            if (fromCodeSource != null) {
                return fromCodeSource;
            }
        } catch (Exception ignored) {
            // Fall through to the default project-root location.
        }

        return workingDir.resolve("database").resolve(DATABASE_SCRIPT_NAME);
    }

    private static Path findDatabaseScript(Path start) {
        for (Path dir = start; dir != null; dir = dir.getParent()) {
            Path candidate = dir.resolve("database").resolve(DATABASE_SCRIPT_NAME);
            if (Files.isRegularFile(candidate)) {
                return candidate;
            }
        }
        return null;
    }

    private static void initializeDatabase(String databaseSql) throws SQLException {
        try (Connection connection = DriverManager.getConnection(SERVER_URL, USER, PASSWORD);
             Statement statement = connection.createStatement()) {
            String database = "`" + DATABASE.replace("`", "``") + "`";
            statement.executeUpdate("CREATE DATABASE IF NOT EXISTS " + database
                    + " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            statement.execute("USE " + database);
            statement.execute(databaseSql);
        }
    }
}
