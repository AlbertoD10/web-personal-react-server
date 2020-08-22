const bcrypt = require("bcrypt"); //Para encriptar las passwords
const jwt = require("../services/jwt");
const User = require("../models/user"); //Importo el modelo user
const fs = require("fs"); //FileSystem
const path = require("path"); //Para manejar los paths de las rutas
const saltRounds = 10;

//Este es el control para registrarse.
function signUp(req, res) {
  const user = new User(); //Instancio un nuevo user, el cual recibo del modelo.

  const { /* name, lastname, */ email, password, repeatPassword } = req.body; //Hago destructuring de lo que recibo del body
  //Hago las asignaciones de lo que recibo a mi nueva instancia.
  // user.name = name;
  // user.lastname = lastname;
  user.email = email.toLowerCase();
  user.role = "admin";
  user.active = false;

  //Hago la validacion de que ingresa contraseñas
  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Las contraseña es obligatoria" });
  } else if (password !== repeatPassword) {
    res.status(404).send({ message: "Las contraseñas no coinciden" });
  }
  //Si son correctas, las encripto
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      res.status(500).send({ message: "Error al encriptar la contraseña" });
    } else {
      //Si no hay errores, asigno la contraseña al modelo
      user.password = hash; //hash es la contraseña encriptada
      console.log("Encriptada correctamente");

      // Con esto guardo el usuario; userStored es el objeto donde se guardara el user.save
      user.save((err, userStored) => {
        if (err) {
          //Aqui puede ser un error del servidor
          res.status(500).send({ message: "Este correo ya existe" });
        } else {
          //Si userStored esta vacio, no se creo bien
          if (!userStored) {
            res.status(404).send({ message: "Error al crear el usuario" });
          } else {
            //Si no hay errores, muestro el objeto y continuo.
            res.status(200).send({ user: userStored });
          }
        }
      });
    }
  });
}

//Control de inicio de sesion
function signIn(req, res) {
  const params = req.body; //Parametros que recibo del login
  const email = params.email.toLowerCase(); //formateo la entrada a minuscula
  const password = params.password; //Pass que me llega del login.

  //Busco el email en la db. (UserStore, es donde almacenare el usuario que llega por findOne)
  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor" });
    } else {
      if (!userStored) {
        res.status(500).send({ message: "Usuario no encontrado" });
      } else {
        //Encontro el usuario y comparo la contraseña
        //password: contraseña sin encriptar; userStre.password: contra encriptada de la BD
        bcrypt.compare(password, userStored.password, (err, result) => {
          if (err) {
            res.status(500).send({ message: "Error del servidor" });
          } else if (!result) {
            res.status(404).send({ message: "Contraseña incorrecta" });
          } else {
            //Valido si el usuario está activo
            if (!userStored.active) {
              res
                .status(200)
                .send({ message: "El usuario no ha sido activado" });
            } else {
              //Si está activado, envio los datos seguros por el token
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored),
              });
            }
          }
        });
      }
    }
  });
}

//Para obtener todos los usuarios
function getUsers(req, res) {
  User.find().then((users) => {
    if (!users) {
      res.status(200).send({ message: "No se ha encontrado ningún usuario" });
    } else {
      res.status(200).send({ users });
    }
  });
}

//Obtengo solo los usuarios activos
function getUsersActive(req, res) {
  const query = req.query; //Obtiene el string de la ruta
  //Voy a buscar al usuario solo si esta activo
  User.find({ active: query.active }).then((users) => {
    if (!users) {
      res.status(200).send({ message: "No hay usuarios inactivos" });
    } else {
      res.status(200).send({ users });
    }
  });
}

//Funcion para subir el avatar del usuario
function uploadAvatar(req, res) {
  const params = req.params;

  User.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor" });
    } else {
      if (!userData) {
        res.status(404).send({ message: "Usuario no encontrado" });
      } else {
        let user = userData;

        if (req.files) {
          //Hago split en la ruta de la imagen para obtener la id
          let filePath = req.files.avatar.path;
          let fileSplit = filePath.split("/");
          let fileExt = fileSplit[2].split(".");
          let fileName = fileSplit[2];

          //Separo la extension de la imagen (PNG O JPEG)
          let fileExtension = fileExt[1];
          if (fileExtension !== "png" && fileExtension !== "jpg") {
            res
              .status(400)
              .send({ message: "Solo se aceptan formatos PNG o JPEG" });
          } else {
            user.avatar = fileName;

            User.findByIdAndUpdate(
              { _id: params.id },
              user,
              (err, userResult) => {
                if (err) {
                  res
                    .status(500)
                    .send({ message: "Ha ocurrido un error en el servidor" });
                } else {
                  if (!userResult) {
                    res
                      .status(404)
                      .send({ message: "No se ha encontrado ningun usuario" });
                  } else {
                    res.status(200).send({ user: userResult });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

//EndPoint para obtener el avatar
function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = "./uploads/avatar/" + avatarName;

  //Verifico si la ruta existe
  fs.stat(filePath, (err, exists) => {
    if (err) {
      res.status(500).send({ message: "Ha ocurrido un error" });
    } else {
      if (!exists) {
        res.status(404).send({ message: "Imagen no encontrada." });
      } else {
        res.sendFile(path.resolve(filePath));
      }
    }
  });
}

function updateUser(req, res) {
  const userData = req.body;
  const params = req.params;

  User.findByIdAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
    console.log(userData);
    if (err) {
      res.status(500).send({ message: "Ha ocurrido un error en el servidor" });
    } else {
      if (!userUpdate) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        res.status(200).send({ message: "Usuario actualizado correctamente." });
      }
    }
  });
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  uploadAvatar,
  getAvatar,
  updateUser,
};
