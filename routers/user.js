const express = require("express");
const UserController = require("../controllers/user");

const api = express.Router();

//Agregamos una nueva ruta, userController se ejecuta cuando se hace un post a /sign-up
api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);

module.exports = api;
