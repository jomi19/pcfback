"use strict";
const respons = require("./respons.js");
const dbrequest = require("./functions/dbrequest");
const { isInt } = require("./functions/myfunctions.js");

function insertValidation(body) {
    if (!isInt(body.id) || body.id < 1) return "id"
    if (!isInt(body.height) || body.height < 1) return "height"
    if (!isInt(body.length) || body.length < 1) return "length"
    if (!isInt(body.width) || body.width < 1) return "width"
    if (!isInt(body.crossMessure)) return "crossMessure"
    if (body.lifts === undefined || body.lifts.length < 1) return "lifts"
    if (body.surface === undefined || body.surface.length < 1) return "surface"
    return false
}


// function NEWinsertValidation(body) {
//     if(!isInt(body.id) || body.id < 1) return "id"
//     if(!isInt(body.height)  || body.height < 1) return "height"
//     if(!isInt(body.length) || body.length < 1) return "length"
//     if(!isInt(bodywidth) || body.width < 1) return "width"
//     if(!isInt(body.crossMessure)) return "crossMessure"
//     if(body.lifts === undefined || body.lifts.length < 1) return "lifts"
//     if(body.surface === undefined || body.surface.length < 1) return "surface"
//     return false
// }


function buildFollowUpInserSql(body) {
    let sql = `INSERT INTO followUp (`;
    let ending = "("

    for (let propety in body) {
        if (propety === "crossMessure") {
            sql = `${sql}crossmesure, `
        }
        else if (propety !== "id") {
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

    for (let propety in body) {
        array.push(body[propety]);
    }
    return array;
}

const followUp = {
    insert: async function (res, body) {
        let test;
        let validationError = insertValidation(body)
        let fields;
        if (validationError) {
            return respons.error(res, 400, "/project", "Felaktig syntax", `Saknar eller felaktigt anget ${validationError}`);
        }


        const sql = buildFollowUpInserSql(body);
        const insertArray = makeInsertArray(body);
        try {
            test = await dbrequest.insert(res, sql, insertArray, "/followup");
        } catch (err) {
            return err;
        }

        return test
    },

    getReadyToFollowUp: async function (res, body) {
        const sql = "SELECT * FROM wallInfo WHERE projectId = ? AND molded IS NOT NULL AND followUp IS NULL"
        const id = body.id;
        let data;

        if (!isInt(id)) {
            return respons.error(res, 400, "/followUp/Ready", `Felaktigt anget id`);
        }
        try {
            data = await dbrequest.getById(res, sql, id, "Kunde inte hitta idt", true);
        }
        catch (err) {
            return err;
        }
        return (res.status(200).json({
            data: data
        }));
    },

    getFollowUp: async function (res, body) {
        const sql = "SELECT * FROM viewFollowUp WHERE id = ?  LIMIT 1";
        const id = body.id;
        let data;



        if (!isInt(id)) {
            return error.error(res, 400, "/followup", "Felaktigt anget id");
        }
        try {
            data = await dbrequest.getById(res, sql, id, "Kunde inte hitta efterkontrollen med det idt", true)
        } catch (err) {

            return err;
        }
        return (res.status(200).json({
            data: data[0]
        }));
    },

    updateFollowUp: async function (res, body) {
        let sql = "UPDATE followUp SET height = ?, width = ?, length = ?, castings = ?, comments = ?, lifts = ?, crossMesure = ?, surface = ?, ursparningar = ? WHERE id = ? LIMIT 1;";
        let fields = makeInsertArray(body);
        let validationError = insertValidation(body)

        console.log(fields)
        if (validationError) {
            return respons.error(res, 400, "/project", "Felaktig syntax", `Saknar eller felaktigt anget ${validationError}`);
        }

        try {
            data = await dbrequest.update(res, sql, fields, "PUT /followUp")
            
        }
        catch (err) {
            return err;
        }
        return (res.status(204).json());
    }
};

module.exports = followUp;
