const express = require('express');
const wall = require('../modules/wall.js');
const router = express.Router();

router.post("/", function(req, res) {
    wall.add(res, req.body);
});

router.get("/unmolded", function(req, res) {
    wall.getUnmolded(res, req.query);
});

router.post("/mold", function(req, res) {
    wall.mold(res, req.body)
})

router.get("/", function(req, res) {
    wall.getWall(res, req.query);
})

router.put("/", (req, res) => {
    wall.update(res, req.body);
});

router.delete("/", (req, res) => {
    wall.delete(res, req.query)
})


module.exports = router;
