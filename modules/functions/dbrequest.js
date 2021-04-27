const { connect } = require("../../routes/project.js");
const mysql = require("mysql");
const { DB } = require("../../config.json");
const error = require("./../error");

let con = mysql.createConnection({
    host: DB.HOST,
    user: DB.USER,
    password: DB.PASSWORD,
    database: DB.DATABASE_NAME
})
con.connect(function(err) {
    if (err) throw err;
    console.log("connected");
})

const dbRequest = {
    getById: function(res, sql, id, checkLength = false) {
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
    },
        
    InsertProject: function(res, sql, costumer, projectName, duedate ) {
        return new Promise((resolve, reject) => {
            con.query(sql, [costumer, projectName, duedate], async (err, result) => {
                if (err) {
                    reject(error.error(res, 500, "/project", "Database error", err.message));
                }
                console.log(result.insertId);
                resolve(result.insertId);
            })
        })
    },

    insertWalls: function(res, sql, walls, id) {
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
    },

    getAllBySql: function (res, sql, path, message) {
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
    },

    insert: function (res, sql, variables, path, message) {
        if(typeof variables != "array") throw "variables needs to be in array format"
        return new Promise((resolve, reject) => {
            con.query(sql, variables, (err, result) => {
                if(err) reject(console.error(res, 500, path, "Database Error", err.message));
                resolve(res.status(202).json({data: "Field/s inserted succesfully"}))
            })
        })
    }  
}
module.exports = dbRequest;