DROP DATABASE IF EXISTS shelter;
CREATE DATABASE shelter
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE shelter;

CREATE TABLE personnel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(191) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE adoptant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(30),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE animal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    personnel_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    espece ENUM('CHAT', 'CHIEN', 'AUTRE') NOT NULL,
    race VARCHAR(100),
    sexe ENUM('MALE', 'FEMELLE') NOT NULL,
    age INT NOT NULL DEFAULT 0,
    poids DECIMAL(6,2) NOT NULL,
    description TEXT,
    photo_url VARCHAR(255),
    statut ENUM('DISPONIBLE', 'ADOPTE', 'EN_ATTENTE_ADOPTION', 'EN_SOIN') NOT NULL DEFAULT 'DISPONIBLE',
    date_arrivee DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_animal_personnel
        FOREIGN KEY (personnel_id) REFERENCES personnel(id)
);

CREATE TABLE demande_adoption (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    adoptant_id INT NOT NULL,
    date_demande DATE NOT NULL,
    statut ENUM('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE') NOT NULL DEFAULT 'EN_ATTENTE',
    motif TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_demande_animal
        FOREIGN KEY (animal_id) REFERENCES animal(id) ON DELETE CASCADE,
    CONSTRAINT fk_demande_adoptant
        FOREIGN KEY (adoptant_id) REFERENCES adoptant(id) ON DELETE CASCADE
);

CREATE TABLE dossier_medical (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    personnel_id INT NOT NULL,
    sterilise BOOLEAN NOT NULL DEFAULT FALSE,
    allergies TEXT,
    vaccins_recus TEXT,
    traitements_en_cours TEXT,
    description TEXT,
    photo_urls TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_dossier_animal
        FOREIGN KEY (animal_id) REFERENCES animal(id) ON DELETE CASCADE,
    CONSTRAINT uq_dossier_medical_animal
        UNIQUE (animal_id),
    CONSTRAINT fk_dossier_personnel
        FOREIGN KEY (personnel_id) REFERENCES personnel(id)
);

CREATE TABLE don (
    id INT AUTO_INCREMENT PRIMARY KEY,
    personnel_id INT NOT NULL,
    type_don ENUM('ARGENT', 'NATURE') NOT NULL,
    valeur DECIMAL(10, 2),
    description TEXT,
    date_don DATE NOT NULL,
    nom_donateur VARCHAR(150),
    telephone_donateur VARCHAR(30),
    photo_url VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_don_personnel
        FOREIGN KEY (personnel_id) REFERENCES personnel(id)
);

-- 3. Comptes du personnel
INSERT INTO personnel (username, email, mot_de_passe) VALUES
('admin', 'admin@shelter.tn', 'personnel123'),
('soignant', 'soignant@shelter.tn', 'personnel123');
