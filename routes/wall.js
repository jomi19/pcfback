const express = require('express');
const wall = require('../modules/wall.js');
const router = express.Router();

router.post("/", function (req, res) {
    wall.add(res, req.body);
});

router.get("/unmolded", function (req, res) {
    wall.getUnmolded(res, req.query);
});

router.put("/mold", function (req, res) {
    console.log("molding")
    wall.mold(res, req.body);
})

router.get("/followup", function (req, res) {
    wall.getReadyToFollowUp(res, req.query);
});

router.get("/ship", function (req, res) {
    wall.getReadyToShip(res, req.query);
});

router.put("/ship", function (req, res) {
    wall.shipWalls(res, req.body);
});

router.get("/", function (req, res) {
    wall.getWall(res, req.query);
});

router.put("/", (req, res) => {
    wall.update(res, req.body);
});

router.delete("/", (req, res) => {
    wall.delete(res, req.query)
});


module.exports = router;
