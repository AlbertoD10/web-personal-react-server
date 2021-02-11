const express = require("express");
const md_auth = require("../middlewares/authenticated");
const MenuController = require("../controllers/menu");

const api = express.Router();

api.post("/add-menu", [md_auth.ensureAuth], MenuController.addMenu);
api.get("/get-menu", MenuController.getMenu);
api.put("/update-menu/:id", [md_auth.ensureAuth], MenuController.updateMenu);
api.delete("/delete-menu/:id", [md_auth.ensureAuth], MenuController.deleteMenu);

module.exports = api;
