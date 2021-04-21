"use strict";
const error = require("./error.js");
const mysql = require("mysql");
const { connect } = require("../routes/project.js");
let con = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "pass",
    database: "exjobb"
})

con.connect(function(err) {
    if (err) throw err;
    console.log("connected");
})

function isInt(value) {
    var x;
    if (isNaN(value)) {
      return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
}

function getById(res, sql, id, checkLength = false) {
    return new Promise((resolve,reject) => {
        con.query(sql, [id], (err, result) => {
            if(err) {
                reject(error.error(res, 500, "/project", "Database error", err.message));
            }

            if(result.length < 1 && checkLength) {
                reject(error.error(res, 404, "/Poject", "Kunde inte hitta idt"));
            }

            resolve(result)
        });
    });
}

function InsertProject(res, sql, costumer, projectName, duedate ) {
    return new Promise((resolve, reject) => {
        con.query(sql, [costumer, projectName, duedate], async (err, result) => {
            if (err) {
                reject(error.error(res, 500, "/project", "Database error", err.message));
            }
            console.log(result.insertId);
            resolve(result.insertId);
        })
    })
}

function insertWalls(res, sql, walls, id) {
    let insertWalls = [];
    console.log(walls);
    console.log("Börjar med väggar")
    return new Promise((resolve, reject) => {
        walls.forEach((element) => {
            let wall = element.split(", ");
            console.log(wall)
            wall.unshift(id);
            while(wall.length < 7) {
                wall.push(null);
            }
            console.log(wall)
            insertWalls.push(wall);
        });
        con.query(sql, [insertWalls], (err, result) => {
            if (err) {
                console.log(err)
                reject(error.error(res, 500, "/project", "Database error", err.message));
            }
            resolve();
        })
    });
}

function getAllBySql(res, sql, path, message) {
    con.query(sql, (err, result) => {
        if (err) {
            return error.error(res, 500, path, "Database error", err.message);
        };

        if (result.length < 1) {
             return error.error(res, 404, path, message);
        }

        return res.status(200).json({
            data: result
         });
     })
}
const project = {
    get: async function(res, body) {
        let sql = "SELECT * FROM getProject WHERE id = ?";
        let wallSql = "SELECT * FROM wallInfo WHERE projectId = ?"
        let id = body.id;
 
        if (!isInt(id) || id < 1) {
            return error.error(res, 400, "/project", "Id måste vara en integer", "Ange id som en integer för att söka")
        }

        try {
            let project =  await getById(res, sql, id, true);
    
            let walls = await getById(res, wallSql, id);
    
            return (res.status(200).json({
                data: project,
                walls: walls
            }));
        }
        catch(err){
           return(err)
        }
        

    },

    getAll: function(res, body) {
        const sql = "SELECT * FROM getProjects";

        return getAllBySql(res, sql, "/project", "Finns inga aktiva projet")
    },

    add: async function(res, body) {
        const sql = "INSERT INTO project (costumer, projectName, duedate) VALUES (? , ?, ?)";
        const wallSql = "INSERT INTO wall (projectId, wallName, height, width, length, amount, castings, other) VALUES ?";
        const statusSql = "INSERT INTO wallStatus (wallId) VALUES ?"
        const walls = body.wall;
        const costumer = body.costumer;
        const projectName = body.project;
        const duedate = body.duedate || null;

        con.query("BEGIN");
        try {
            let id = await InsertProject(res, sql, costumer, projectName, duedate);
            await insertWalls(res, wallSql , walls, id);
            con.query("COMMIT");

            return res.status(200).json({
                id: id
            });
        }
        catch(err) {

            con.query("ROLLBACK");
            return err;
        }
        
    },

    delete: function(res, body) {
        const sql = "UPDATE project SET deleted = ? WHERE id = ? LIMIT 1;"
        const id = body.id;
        const time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        console.log(time)
        if (!isInt(id) || id < 1) {
            return error.error(res, 400, "/project", "Id måste vara en integer", "Ange id som en integer för att söka")
        }

        con.query(sql, [time, id], (err, result) => {
            if (err) {
                console.log("error")
                return error.error(res, 500, "/project", "Database error", err.message);
            };

            if (result.changedRows === 0) {
                 return error.error(res, 404, "/project", "Projekt id kunde inte hittas");
            }
            return res.status(200).json();
        })


    },

    update: function(res, body) {
        
    },

    getArchive: function(res, query) {
        const sql = "SELECT * FROM getArchive";

        return getAllBySql(res, sql, "/project/archive", "Inga akriverade projet")
    }
}

module.exports = project;