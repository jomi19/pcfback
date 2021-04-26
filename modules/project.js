"use strict";
const error = require("./error.js");
const con = require("../db/db.js");
const dbRequest = require("./functions/dbrequest.js");
const { isInt } = require("./functions/myfunctions.js");


const project = {
    get: async function(res, body) {
        let sql = "SELECT * FROM getProject WHERE id = ?";
        let wallSql = "SELECT * FROM wallInfo WHERE projectId = ?"
        let id = body.id;
 
        if (!isInt(id) || id < 1) {
            return error.error(res, 400, "/project", "Id måste vara en integer", "Ange id som en integer för att söka")
        }

        try {
            let project =  await dbRequest.getById(res, sql, id, true);
    
            let walls = await dbRequest.getById(res, wallSql, id);
    
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

        return dbRequest.getAllBySql(res, sql, "/project", "Finns inga aktiva projet")
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
            let id = await dbRequest.InsertProject(res, sql, costumer, projectName, duedate);
            await dbRequest.insertWalls(res, wallSql , walls, id);
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

        return dbRequest.getAllBySql(res, sql, "/project/archive", "Inga akriverade projet")
    }
}

module.exports = project;