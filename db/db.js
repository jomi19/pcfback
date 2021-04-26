const { connect } = require("../routes/project.js");
const mysql = require("mysql");
let con = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "pass",
    database: "exjobb"
})
module.exports = (function () {
    return con.connect(function(err) {
        if (err) throw err;
        console.log("connect")
    })
})