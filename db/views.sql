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
        p.costumer
    FROM wall AS w
    LEFT OUTER JOIN wallStatus AS s ON w.id = s.wallId
    LEFT OUTER JOIN followUp AS a ON s.id = a.wallStatusId
    LEFT OUTER JOIN project AS p ON w.projectId = p.id
    ORDER BY w.wallName
;

DROP VIEW IF EXISTS viewFollowUp;
CREATE VIEW viewFollowUp AS
	SELECT
		s.id,
		p.costumer,
		p.projectName,
		w.width AS wallWidth,
		w.height AS wallHeight,
		w.length AS wallLength,
		w.castings AS wallCastings,
		w.wallName,
		w.other,
		s.molded,
		s.followUp,
		f.height,
		f.width,
		f.length,
		f.castings,
		f.comments,
		f.lifts,
		f.crossMesure,
		f.surface,
		f.ursparningar
	FROM followUp AS f
	LEFT OUTER JOIN wallStatus AS s ON f.wallStatusId = s.id
	LEFT OUTER JOIN wall AS w ON s.wallId = w.id
	LEFT OUTER JOIN project AS p ON w.projectId = p.id
;

DROP TRIGGER IF EXISTS addWallStatus;
DROP TRIGGER IF EXISTS followUpStatus;
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
    
    
SELECT * FROM wallInfo WHERE id = 1 & molded IS NULL;


SELECT * FROM wallStatus;