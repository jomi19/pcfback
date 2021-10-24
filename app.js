const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { PORT } = require("./config.json");

const followUp = require("./routes/followup");
const project = require("./routes/project");
const wall = require("./routes/wall");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    if(process.env.NODE_ENV != "test") {
        console.log(req.method);
        console.log(req.path)
        console.log(req.query);
    }
    next();
});

app.use("/project", project);
app.use("/followup", followUp);
app.use("/wall", wall);

const server = app.listen(PORT, () => console.log(`App listning at port ${PORT}`));

module.exports = server;