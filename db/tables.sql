DROP TABLE IF EXISTS followUp;
DROP TABLE IF EXISTS wallStatus;
DROP TABLE IF EXISTS wall;
DROP TABLE IF EXISTS project;


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

SELECT * FROM wallStatus;
