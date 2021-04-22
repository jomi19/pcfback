"use strict";
const error = require("./error.js");
const mysql = require("mysql");

let con = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "pass",
    database: "exjobb"
})

function insertValidation(body) {
    if(body.id === undefined || body.id.length < 1) return false
    if(body.height === undefined || body.height.length < 1) return false
    if(body.length === undefined || body.length.length < 1) return false
    if(body.width === undefined || body.width.length < 1) return false
    if(body.crossMessure === undefined || body.crossMessure.length < 1) return false
    if(body.lifts === undefined || body.lifts.length < 1) return false
    if(body.surface === undefined || body.surface.length < 1) return false
    return true
}

function buildFollowUpInserSql(body) {
    let sql = `INSERT INTO followUp (`;
    let ending = "("

    for (let propety in body) {
        if (propety === "crossMessure") {
            sql = `${sql}crossmesure, `
        }
        else if(propety !== "id") {
            sql = `${sql}${propety}, `
            
        } else {
            sql = `${sql}wallStatusId, `
        }
        ending = `${ending}?, `
    }
    sql = sql.replace(/..$/, ") VALUES ")
    ending = ending.replace(/..$/, ")")
    sql = `${sql} ${ending}`;
    return sql
}

function makeInsertArray(body) {
    let array = []

    for(let propety in body) {
        array.push(body[propety]);
    }
    return array;
}

const followUp = {
    insert: async function(res, body) {
        let test;
        if(!insertValidation(body)) {
            return error.error(res, 500, "/project", "Database error", "Gick dåligt de där");
        }
        const sql = buildFollowUpInserSql(body);
        const insertArray = makeInsertArray(body);
        console.log(sql)
        console.log(insertArray)
        con.query(sql, insertArray, (err, result) => {
            if(err) {
                test = error.error(res, 500, "/project", "Database error", err.message);
            }
            test = (res.status(202).json(result))
        });
        return test
    },
};

module.exports = followUp;
