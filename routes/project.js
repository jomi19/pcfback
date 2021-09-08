const express = require('express');
const project = require('../modules/project.js');
const router = express.Router();

router.post("/", function(req, res) {
    project.add(res, req.body);
});

router.get("/all", (req, res) => {
    project.getAll(res, req.body);
})

router.get("/", function(req, res) {
    project.get(res, req.query);
});

router.get("/archive", function(req, res) {
    project.getArchive(res, req.query);
});

router.put("/", (req, res) => {
    project.update(res, req.body);
});

router.delete("/", (req, res) => {
    project.archive(res, req.query)
})

router.post("/unarchive", function(req, res) {
    console.log("testaar")
    project.unArchive(res, req.body)
});


module.exports = router;
