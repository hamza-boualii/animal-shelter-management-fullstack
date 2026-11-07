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

-- 3. Donnees de test
INSERT INTO personnel (username, email, mot_de_passe) VALUES
('admin', 'admin@shelter.tn', 'personnel123'),
('soignant', 'soignant@shelter.tn', 'personnel123');

INSERT INTO adoptant (nom, prenom, email, mot_de_passe, telephone) VALUES
('Ben Ali', 'Amine', 'amine.benali@mail.tn', 'adoptant123', '98123456'),
('Trabelsi', 'Sarra', 'sarra.trabelsi@mail.tn', 'adoptant123', '97456789');

INSERT INTO animal (personnel_id, nom, espece, race, sexe, age, description, photo_url, statut, date_arrivee) VALUES
(1, 'Rex', 'CHIEN', 'Berger allemand', 'MALE', 3, 'Chien calme et obeissant, habitue aux enfants.', NULL, 'EN_ATTENTE_ADOPTION', '2026-09-10'),
(2, 'Minou', 'CHAT', 'Siamois', 'FEMELLE', 2, 'Chatte sociable et propre.', NULL, 'DISPONIBLE', '2026-09-15'),
(1, 'Bella', 'CHIEN', 'Labrador', 'FEMELLE', 4, 'Chienne affectueuse, en cours de soins.', NULL, 'EN_SOIN', '2026-10-01'),
(2, 'Luna', 'CHAT', 'Europeen', 'FEMELLE', 1, 'Jeune chatte joueuse.', NULL, 'ADOPTE', '2026-10-20'),
(1, 'Max', 'CHIEN', 'Husky', 'MALE', 5, 'Chien energique, a besoin d\'espace.', NULL, 'DISPONIBLE', '2026-08-05');

INSERT INTO demande_adoption (animal_id, adoptant_id, date_demande, statut, motif) VALUES
(1, 1, '2026-10-25', 'EN_ATTENTE', 'Je dispose d\'un jardin et je souhaite adopter un chien.'),
(4, 2, '2026-10-22', 'ACCEPTEE', 'Je recherche un chat de compagnie.'),
(2, 1, '2026-10-18', 'REFUSEE', 'Demande retiree par l\'adoptant.');

INSERT INTO dossier_medical (animal_id, personnel_id, sterilise, allergies, vaccins_recus, traitements_en_cours, description, photo_urls) VALUES
(2, 2, TRUE, 'Aucune', 'RCP, Rage', 'Aucun', 'Examen general satisfaisant.', NULL),
(3, 1, FALSE, 'Penicilline', 'DHPP', 'Antibiotique pendant 5 jours', 'Surveillance de la patte arriere droite.', NULL),
(4, 2, TRUE, 'Aucune', 'RCP, Rage', 'Aucun', 'Animale en bonne sante avant adoption.', NULL);

INSERT INTO don (personnel_id, type_don, valeur, description, date_don, nom_donateur, telephone_donateur, photo_url) VALUES
(1, 'ARGENT', 250.00, 'Don pour l\'achat de croquettes.', '2026-10-01', 'Ahmed Ben Ali', '98123456', NULL),
(2, 'NATURE', 120.00, 'Croquettes et couvertures.', '2026-10-12', 'Sara Trabelsi', '97456789', NULL);
