"use strict";
const error = require("./../error.js");
const mysql = require("mysql");

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
const sqlFunctions = {
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
    }
}

module.exports = sqlFunctions;