const error = require("./error.js");
const sqlFunctions = require("./functions/sqlfunctions");
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

const wall = {

    add: function() {

    },

    mold: function(res, body) {
        const sql = "UPDATE wallStatus SET molded = ? where id = ? LIMIT 1";
        const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const id = body.id;

        con.query(sql, [time, id], (err, result) => {
            if (err) {
                return error.error(res, 500, "/wall/mold", "Database error", err.message);
            };

            if (result.changedRows === 0) {
                return error.error(res, 404, "/wall.mold", "Vägg id kunde inte hittas");
            }
            return res.status(200).json();
        })
    },

    get: async function(res, body) {
        const sql = "SELECT * FROM wallInfo WHERE id = ?;"
        const id = body.id;
        const data = await sqlFunctions.getById(res, sql, id, "Kunde inte hitta idt");

        console.log(id)
        return (res.status(200).json({
            data: data[0]
        }));
    }
}

module.exports = wall;