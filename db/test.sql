DROP DATABASE IF EXISTS pcftest;
CREATE DATABASE pcftest;
GRANT ALL PRIVILEGES
ON *.*
TO 'user'@'%'
WITH GRANT OPTION
;
USE pcftest;

CREATE TABLE project (
	id INT AUTO_INCREMENT,
    costumer VARCHAR(50) NOT NULL,
    projectName VARCHAR(50),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duedate TIMESTAMP,
    done TIMESTAMP,
    deleted TIMESTAMP,

    PRIMARY KEY (id)
);

CREATE TABLE wall (
	id INT AUTO_INCREMENT,
    projectId INT NOT NULL,
    wallName VARCHAR(20) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    length INT NOT NULL,
    castings VARCHAR(255),
    other VARCHAR(255),
    amount INT NOT NULL,

    PRIMARY KEY (id),
	FOREIGN KEY (projectId) REFERENCES project(id)
);

CREATE TABLE wallStatus(
	id INT AUTO_INCREMENT,
    wallId INT NOT NULL,
    molded TIMESTAMP,
    followUp TIMESTAMP,
    shipped TIMESTAMP,
    
    PRIMARY KEY (id),
    FOREIGN KEY (wallId) REFERENCES wall(id)
);

CREATE TABLE followUp (
	id INT AUTO_INCREMENT,
	wallStatusId INT NOT NULL UNIQUE,
    height INT NOT NULL,
    width INT NOT NULL,
    length INT NOT NULL,
    castings VARCHAR(255),
    comments VARCHAR(255),
    lifts VARCHAR(255),
    crossMesure INT NOT NULL,
    surface VARCHAR(255),
    ursparningar VARCHAR(255),
    form VARCHAR(255),
    
    PRIMARY KEY (id),
    FOREIGN KEY (wallStatusId) REFERENCES wallStatus(id)
);


CREATE VIEW getProjects AS
	SELECT 
		p.id,
		p.projectName,
		p.costumer,
		p.created,
		COUNT(s.id) AS amount,
		COUNT(s.molded) AS molded,
		COUNT(s.followUp) AS controlls
		FROM project AS p 
		LEFT OUTER JOIN wall AS w ON w.projectId = p.id 
		LEFT OUTER JOIN wallStatus AS s ON  w.id = s.wallId
        WHERE p.deleted IS NULL
		GROUP BY p.id
;


CREATE VIEW getArchive AS
	SELECT 
		p.id,
		p.projectName,
		p.costumer,
		p.created,
        p.deleted,
		COUNT(s.id) AS amount,
		COUNT(s.molded) AS molded,
		COUNT(s.followUp) AS controlls
		FROM project AS p 
		LEFT OUTER JOIN wall AS w ON w.projectId = p.id 
		LEFT OUTER JOIN wallStatus AS s ON  w.id = s.wallId
        WHERE p.deleted IS NOT NULL
		GROUP BY p.id
;

CREATE VIEW getProject AS
	SELECT  p.costumer,
			p.projectName,
			p.id,
            p.deleted,
            w.wallName,
            COUNT(s.molded) AS molded,
            COUNT(s.followUp) AS followUp,
            COUNT(s.id) AS amount,
            p.created
    FROM 	project AS p
	LEFT OUTER JOIN wall AS w ON w.projectId = p.id
	LEFT OUTER JOIN wallStatus AS s ON w.id = s.wallId
    GROUP BY p.id
;


CREATE VIEW wallInfo AS
	SELECT 
		w.wallName,
        s.molded,
        s.id,
        s.followUp,
        s.shipped,
        a.id AS followUpId,
        w.id AS wallId,
        w.height,
        w.width,
        w.length,
		w.projectId,
        w.castings,
        w.other,
        p.projectName,
        p.costumer
    FROM wall AS w
    LEFT OUTER JOIN wallStatus AS s ON w.id = s.wallId
    LEFT OUTER JOIN followUp AS a ON s.id = a.wallStatusId
    LEFT OUTER JOIN project AS p ON w.projectId = p.id
    ORDER BY w.wallName
;

DELIMITER ;;
CREATE TRIGGER addWallStatus
	AFTER INSERT ON wall FOR EACH ROW
    BEGIN
		DECLARE x INT DEFAULT 0;
        WHILE x < NEW.amount DO
			INSERT INTO wallStatus (wallId) VALUES (NEW.id);
            SET x = x + 1;
		END WHILE;
	END;;

CREATE TRIGGER followUpStatus
	AFTER INSERT ON followUp FOR EACH ROW
    BEGIN
		UPDATE wallStatus
		SET followUp = CURRENT_TIMESTAMP
		WHERE id = NEW.wallStatusId; 
    END;;
DELIMITER ;


INSERT INTO project (costumer, projectName) VALUES ("Test", "project"),("Second test", "second project");
INSERT INTO wall (projectId, wallName, width, height, length, amount) VALUES (1, "v-01", 150, 140, 20, 1), (1, "v-02", 150, 140, 20, 2);
UPDATE wallStatus SET molded = CURRENT_TIMESTAMP WHERE id = 1 OR id = 2;
INSERT INTO followUp (wallStatusId, width, height, length, lifts, crossMesure, surface) VALUES (3, 20, 30, 20, "OK", 0, "OK")