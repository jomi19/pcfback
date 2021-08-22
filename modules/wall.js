const error = require("./error.js");
const dbrequest = require("./functions/dbrequest");
const myFunctions = require("./functions/myfunctions");

const wall = {

    add: function () {

    },

    getReadyToShip: async function (res, body) {
        const sql = "SELECT * FROM wallInfo WHERE projectId = ? AND molded IS NOT NULL AND shipped is NULL";
        const id = body.id;
        let data;
        if (!myFunctions.isInt(id)) {
            return error.error(res, 400, "/wall/ship", "Inget project id angett");
        }

        try {
            data = await dbrequest.getById(res, sql, id, "Kunde inte hitta idt");
        }
        catch {

        }
        return (res.status(200).json({
            data: data
        }))
    },

    getWall: async function (res, body) {
        const sql = "SELECT * FROM wallInfo WHERE id = ?"
        const id = body.id
        let data;
        if (!myFunctions.isInt(id)) {
            return error.error(res, 400, "/wall/", "Inget/felaktigt angett id");
        }
        try {
            data = await dbrequest.getById(res, sql, id, "Kunde inte hitta väggen med det idt")
        }
        catch (err) {
            return (err)
        }
        return (res.status(200).json({
            data: data[0]
        }))
    },

    shipWalls: async function (res, body) {
        let sql = `UPDATE wallStatus SET shipped = '${myFunctions.sqlTimestomp()}' WHERE id = `;
        const walls = body.walls;
        let addSql = [];
        let changedRows;
        console.log(typeof walls)
        if (typeof walls != "object" && !myFunctions.isInt(walls)) return error.error(res, 404, "/wall/ship", "Inget vägg id angett");
    
        if (typeof walls == "object" && walls.length < 1)  return error.error(res, 404, "/wall/ship", "Inget vägg id angett");
        if (typeof walls == "object") {
            walls.forEach(wall => {
                if (myFunctions.isInt(wall)) {
                    addSql.push(wall);
                    sql = `${sql}? OR id = `;
                }
            })
            sql = sql.replace(/ OR id = $/, ";");
        } else {
            addSql.push(walls);
            sql = `${sql}?;`;
        }
        try {
            changedRows = await dbrequest.update(res, sql, addSql, "/walls/ship");
        } catch (err) {
            return error.error(res, err.message, "/wall/ship", err.error, err.message);
        }
        return res.status(200).json({ changedRows: changedRows });
    },

    mold: async function (res, body) {
        let sql = `UPDATE wallStatus SET molded = '${myFunctions.sqlTimestomp()}' WHERE id = `;
        const walls = body.walls;
        let addSql = [];

        console.log(typeof walls)
        if (typeof walls != "object" && !myFunctions.isInt(walls)) return error.error(res, 404, "Felaktigt anget id")
        if (typeof walls == "object" && walls.length < 1) return error.error(res, 404, "/wall/ship", "Inget vägg id angett");

        if (typeof walls == "object") {
            
            walls.forEach(wall => {
                addSql.push(wall);
                sql = `${sql}? OR id = `;
            })
            sql = sql.replace(/ OR id = $/, ";");
        } else {
            addSql.push(walls);
            sql = `${sql}?;`;
        }
        console.log(walls)
        try {
            changedRows = await dbrequest.update(res, sql, walls, "/walls/mold")
        } catch (err) {
            console.log("array")
            return error.error(res, 404, "/wall/mold", err.error, err.message);;
        }

        return res.status(200).json({ changedRows});
    },

    getUnmolded: async function (res, body) {
        const sql = "SELECT * FROM wallInfo WHERE projectId = ? AND molded IS NULL"
        const id = body.id;
        let data;

        if (!myFunctions.isInt(id)) {
            return error.error(res, 400, "/wall/ship", "Inget project id angett");
        }
        try {
            data = await dbrequest.getById(res, sql, id, "Kunde inte hitta idt");
        }
        catch {

        }

        return (res.status(200).json({
            data: data
        }));
    }
}

module.exports = wall;