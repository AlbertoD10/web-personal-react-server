const express = require("express");
const api = express.Router();
const newsLetterController = require("../controllers/newsletter");

api.post("/suscribe-newsletter/:email", newsLetterController.suscribeEmail);

module.exports = api;
