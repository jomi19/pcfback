const mysql = require("mysql");
const { DB } = require("../../config.json");
const respons = require("../respons");
const error = require("../respons");
let dbName = DB.DATABASE_NAME

if (process.env.NODE_ENV === "test") {
    dbName = "pcftest";
}

let con = mysql.createConnection({
  host: DB.HOST,
  user: DB.USER,
  password: DB.PASSWORD,
  database: dbName,
});

con.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to ${dbName}`);
});

const dbRequest = {
  
  getAllFromTable: function(res, table, path, message) {
    const sql = `SELECT * FROM ${table};`;

    con.query(sql, (err, result) => {
      if (err) {
        return respons.error(res, 500, path, "Database error", err.message);
      }

      if (result.length < 1) {
        return respons.error(res, 404, path, message);
      }

      return res.status(200).json({
        data: result,
      });
    });
  },

  getById: function (res, sql, id, checkLength = false) {
    return new Promise((resolve, reject) => {
      con.query(sql, [id], (err, result) => {
        if (err) {
          reject(
            respons.error(res, 500, "/project", "Database error", err.message)
          );
        }
        if (result.length < 1 && checkLength) {

          reject(respons.error(res, 404, "/Poject", "Kunde inte hitta idt"));
        }
        resolve(result);
      });
    });
  },

  begin: function () {
    con.query("BEGIN");
  },

  rollBack: function () {
    con.query("ROLLBACK");
  },

  commit: function () {
    con.query("COMMIT");
  },

  update: function(res, sql, variables, path) {
    return new Promise((resolve, reject) => {
      con.query(sql, variables, (err, result) => {
        if (err) {
          
          reject(respons.error(res, 500, path, "Database error", err.message));
        }

        if (result.changedRows === 0) {
          console.log(result)
          reject(respons.error(res, 404, path, "Kunde inte hitta fältet/fälten som skulle updateras"));
        }
        resolve(result.changedRows)
      });
    });
  },

  InsertProject: function (res, sql, costumer, projectName, duedate) {
    return new Promise((resolve, reject) => {
      con.query(sql, [costumer, projectName, duedate], async (err, result) => {
        if (err) {
          reject(
            respons.error(res, 500, "/project", "Database error", err.message)
          );
        }
        resolve(result.insertId);
      });
    });
  },

  insertWalls: function (res, sql, walls, id) {
    let insertWalls = [];

    walls.forEach((element) => {
      insertWalls.push([id, element.wallName, element.height, element.width, element.length, element.amount, element.castings, element.other])
    }); 
    return new Promise((resolve, reject) => {
      if (insertWalls.length < 1) {
        reject(respons.error(res, 400, "Project", "No walls", "No walls added to project"))
        return
      }
      con.query(sql, [insertWalls], (err, result) => {
        if (err) {
          reject(
            respons.error(res, 500, "/project", "Database error", err.message)
          );
        }
        resolve();
      });
    });
  },

  insert: function (res, sql, variables, path, message) {
    if (typeof variables != "object")
      throw "variables needs to be in array format";
    return new Promise((resolve, reject) => {
      con.query(sql, variables, (err, result) => {
        if (err) {
          console.log("ERROR")
          reject(respons.error(res, 500, path, "Database Error", err.message))
         
        };
        if(result) {
          resolve(res.status(202).json({ data: "Field/s inserted succesfully", id: result.insertId }));
        }
        
      });
    });
  },
};
module.exports = dbRequest;
