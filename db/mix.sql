INSERT INTO project (costumer, projectName) VALUES ("Joakim", "Första projecktet"),("Joakim", "Andra projektet");

SELECT * FROM project;
SELECT * FROM wallStatus;
INSERT INTO wall (projectId, wallName, width, height, length) VALUES (1, "v-01", 150, 140, 20), (1, "v-02", 150, 140, 20),(1, "v-03", 150, 170, 20);
INSERT INTO wallStatus (wallId) VALUES (1),(1),(1),(2);
CREATE VIEW getProjects AS
	SELECT p.projectName,
		p.costumer,
		p.created,
		COUNT(s.id) AS amount,
		COUNT(s.molded) AS molded,
		COUNT(s.followUp) AS controlls
		FROM project AS p 
		LEFT OUTER JOIN wall AS w ON w.projectId = p.id 
		LEFT OUTER JOIN wallStatus AS s ON  w.id = s.wallId
        WHERE p.deleted IS NULL
		GROUP BY p.projectName
;


CREATE TABLE wallStatus(
	id INT AUTO_INCREMENT,
    wallId INT NOT NULL,
    molded TIMESTAMP,
    followUp TIMESTAMP,
    shipped TIMESTAMP,
    
    PRIMARY KEY (id),
    FOREIGN KEY (wallId) REFERENCES wall(id)
);

UPDATE wallStatus SET molded = CURRENT_TIMESTAMP, shipped = CURRENT_TIMESTAMP WHERE id = 3 LIMIT 1;