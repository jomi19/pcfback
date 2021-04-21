
USE exjobb;

GRANT ALL PRIVILEGES
ON *.*
TO 'user'@'%'
WITH GRANT OPTION
;

SELECT * FROM project;
SELECT * FROM wall;


SELECT * FROM project AS p LEFT OUTER JOIN wall AS w ON w.projectId = p.id WHERE p.deleted IS NULL; 

SELECT p.costumer, p.created, p.duedate, COUNT(w.projectId) AS walls FROM project AS p LEFT OUTER JOIN wall AS w ON w.projectId = p.id GROUP BY p.costumer; 


    
SELECT * FROM getProject WHERE id = 2;
SELECT * FROM project;
SELECT * FROM getProjects;