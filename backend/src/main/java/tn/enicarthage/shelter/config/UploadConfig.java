package tn.enicarthage.shelter.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public final class UploadConfig {

    private static final String PROPERTY_NAME = "shelter.upload.dir";
    private static final String ENV_VAR_NAME = "SHELTER_UPLOAD_DIR";
    private static final String DEFAULT_SUBFOLDER = "uploads";
    private static final String ANIMALS_SUBFOLDER = "animals";

    private UploadConfig() {
    }

    public static Path getUploadDir() {
        String prop = System.getProperty(PROPERTY_NAME);
        if (prop != null && !prop.isBlank()) {
            return prepareDir(Paths.get(prop).toAbsolutePath().normalize());
        }

        String env = System.getenv(ENV_VAR_NAME);
        if (env != null && !env.isBlank()) {
            return prepareDir(Paths.get(env).toAbsolutePath().normalize());
        }

        Path projectRoot = resolveProjectRoot();
        return prepareDir(projectRoot.resolve(DEFAULT_SUBFOLDER).toAbsolutePath().normalize());
    }

    public static Path getAnimalsUploadDir() {
        Path animalsDir = getUploadDir().resolve(ANIMALS_SUBFOLDER).normalize();
        return prepareDir(animalsDir);
    }

    private static Path prepareDir(Path dir) {
        try {
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }
        } catch (IOException e) {
            throw new RuntimeException("Impossible d'initialiser le dossier d'uploads : " + dir, e);
        }
        return dir;
    }

    private static Path resolveProjectRoot() {
        Path current = Paths.get("").toAbsolutePath();
        for (Path p = current; p != null; p = p.getParent()) {
            if (Files.isRegularFile(p.resolve("database").resolve("database.sql"))) {
                return p;
            }
        }
        try {
            Path codeSource = Paths.get(UploadConfig.class.getProtectionDomain()
                    .getCodeSource().getLocation().toURI());
            for (Path p = codeSource.toAbsolutePath(); p != null; p = p.getParent()) {
                if (Files.isRegularFile(p.resolve("database").resolve("database.sql"))) {
                    return p;
                }
            }
        } catch (Exception ignored) {
        }
        return current;
    }
}
