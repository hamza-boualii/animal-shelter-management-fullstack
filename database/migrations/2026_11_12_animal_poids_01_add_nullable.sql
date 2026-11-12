USE shelter;

ALTER TABLE animal
    ADD COLUMN poids DECIMAL(6,2) NULL AFTER age;

SELECT id, nom, espece, race, statut, date_arrivee
FROM animal
WHERE poids IS NULL
ORDER BY id;
