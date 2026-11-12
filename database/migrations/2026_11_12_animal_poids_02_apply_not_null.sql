USE shelter;

SELECT id, nom, espece, race, statut, date_arrivee
FROM animal
WHERE poids IS NULL
ORDER BY id;

ALTER TABLE animal
    MODIFY COLUMN poids DECIMAL(6,2) NOT NULL;
