"use strict";
const respons = require("./respons.js");
const dbRequest = require("./functions/dbrequest")
const { isInt } = require("./functions/myfunctions.js");

const project = {
    get: async function(res, body) {
        let sql = "SELECT * FROM getProject WHERE id = ?";
        let wallSql = "SELECT * FROM wallInfo WHERE projectId = ?"
        let id = body.id;

        if (!isInt(id) || id < 1) {
            return respons.error(res, 400, "/project", "Id måste vara en integer", "Ange id som en integer för att söka")
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
           return(err);
        }
    },

    getAll: function(res, body) {
        const table = "getProjects";

        return dbRequest.getAllFromTable(res, table, "/project", "Finns inga aktiva projet")
    },

    add: async function(res, body) {
        const sql = "INSERT INTO project (costumer, projectName, duedate) VALUES (? , ?, ?)";
        const wallSql = "INSERT INTO wall (projectId, wallName, height, width, length, amount, castings, other) VALUES ?";
        const statusSql = "INSERT INTO wallStatus (wallId) VALUES ?"
        const walls = body.walls;
        const costumer = body.costumer;
        const projectName = body.project;
        const duedate = body.duedate || null;

        if(!costumer) return respons.error(res, 400, "/project", "Kund inte angett");
        if(!projectName) return error.error(res, 400, "/project", "Inget projekt namn angett");

        dbRequest.begin();
        try {
            let id = await dbRequest.InsertProject(res, sql, costumer, projectName, duedate);
            await dbRequest.insertWalls(res, wallSql , walls, id);
            dbRequest.commit();

            return res.status(201).json({
                id: id
            });
        }
        catch(err) {
            dbRequest.rollBack();
            return err;
        }
        
    },
 
    unArchive: async function(res, body) {
        const sql = "UPDATE project SET deleted = ? WHERE id = ? LIMIT 1";
        const id = body.id;
        console.log("returbning")
        if (!isInt(id) || id < 1) {
            return error.error(res, 400, "/project", "Id måste vara en integer", "Ange id som en integer för att söka")
        }
        try {
            await dbRequest.insert(res, sql, [null, id], "Delete")
        } catch(err) {
            return err
        }
    },

    archive: async function(res, body) {
        const sql = "UPDATE project SET deleted = ? WHERE id = ? LIMIT 1;"
        const id = body.id;
        const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let response;

        if (!isInt(id) || id < 1) {
            return error.error(res, 400, "/project", "Id måste vara en integer", "Ange id som en integer för att söka")
        }
        try {
            await dbRequest.insert(res, sql, [time, id], "Delete")
        } catch(err) {
            return err
        }

        return response;
    },


    update: function(res, body) {
        
    },

    getArchive: function(res, query) {
        const table = "getArchive";

        return dbRequest.getAllFromTable(res, table, "/project/archive", "Inga akriverade projet")
    }
}

module.exports = project;