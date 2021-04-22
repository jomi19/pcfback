DROP VIEW IF EXISTS getProjects;

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

DROP VIEW IF EXISTS getArchive;
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

SELECT * FROM getArchive;
    
DROP VIEW IF EXISTS getProject;
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

DROP VIEW IF EXISTS wallInfo;
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
        p.costumer,
        COUNT(s.id)-COUNT(s.molded) AS wallsLeft
    FROM wall AS w
    LEFT OUTER JOIN wallStatus AS s ON w.id = s.wallId
    LEFT OUTER JOIN followUp AS a ON s.id = a.wallStatusId
    LEFT OUTER JOIN project AS p ON w.projectId = p.id
    ORDER BY w.wallName
;

SELECT * FROM wallInfo WHERE id = 16;
DROP TRIGGER IF EXISTS addWallStatus;
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
    
DELIMITER ;
    
    
SELECT * FROM wallInfo WHERE id = 1 & molded IS NULL;


SELECT * FROM wallStatus;