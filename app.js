const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const project = require("./routes/project");
const wall = require("./routes/wall");

const port = 1337;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.body);
    next();
});

app.get("/", (req, res) => {
    con.query("SELECT * FROM projekt", (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    })
});

app.use("/project", project)

app.use("/wall", wall)

app.listen(port, () => console.log(`App listning at port ${port}`))