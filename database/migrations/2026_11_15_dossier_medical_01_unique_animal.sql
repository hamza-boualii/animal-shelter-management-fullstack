USE shelter;

SELECT animal_id, COUNT(*) AS nb_dossiers
FROM dossier_medical
GROUP BY animal_id
HAVING nb_dossiers > 1;

ALTER TABLE dossier_medical
    ADD CONSTRAINT uq_dossier_medical_animal UNIQUE (animal_id);
