const express = require('express');
const router = express.Router();
const followUp = require("../modules/followup")
const wall = require("../modules/wall");

router.post("/", function(req, res) {

    followUp.insert(res, req.body);
});

router.get("/", function(req, res) {
    followUp.getFollowUp(res, req.query);
});

router.get("/ready", function(req, res) {
    console.log("Ready")
    followUp.getReadyToFollowUp(res, req.query);
});



module.exports = router;
