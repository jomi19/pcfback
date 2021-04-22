const express = require('express');
const router = express.Router();
const followUp = require("../modules/followup")

router.post("/", function(req, res) {

    followUp.insert(res, req.body);
});

module.exports = router;
