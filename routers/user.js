const express = require("express");
const UserController = require("../controllers/user");
const md_auth = require("../middlewares/authenticated");
const api = express.Router();

//Agregamos una nueva ruta, userController se ejecuta cuando se hace un post a /sign-up
api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);
api.get("/users", [md_auth.ensureAuth], UserController.getUsers); //Primero se ejecuta el middleware, despues el usercontrool
api.get("/users-active", [md_auth.ensureAuth], UserController.getUsersActive);

module.exports = api;
