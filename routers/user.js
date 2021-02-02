const express = require("express");
const multipart = require("connect-multiparty");
const UserController = require("../controllers/user");
const md_auth = require("../middlewares/authenticated");
const api = express.Router();

//Ruta en la que se guardaran las imagenes que subo
const md_upload_avatar = multipart({ uploadDir: "./uploads/avatar" });

//Agregamos una nueva ruta, userController se ejecuta cuando se hace un post a /sign-up
api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);
api.get("/users", [md_auth.ensureAuth], UserController.getUsers); //Primero se ejecuta el middleware, despues el usercontrool
api.get("/users-active", [md_auth.ensureAuth], UserController.getUsersActive);
api.put(
  "/upload-avatar/:id",
  [md_auth.ensureAuth, md_upload_avatar],
  UserController.uploadAvatar
);
api.get("/get-avatar/:avatarName", UserController.getAvatar);
api.put("/update-user/:id", [md_auth.ensureAuth], UserController.updateUser);
api.put(
  "/activate-user/:id",
  [md_auth.ensureAuth],
  UserController.activateUser
);
api.delete("/delete-user/:id", [md_auth.ensureAuth], UserController.deleteUser);
api.post("/sign-up-admin/", [md_auth.ensureAuth], UserController.signUpAdmin);
module.exports = api;
