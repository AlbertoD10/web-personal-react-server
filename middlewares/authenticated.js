const moment = require("moment");
const jwt = require("jwt-simple");
// const { SECRET_KEY } = require("../services/jwt");

//Middleware para que solo usuarios logueados y con token validos puedan estar dentro.

exports.ensureAuth = (req, res, next) => {
  const SECRET_KEY = "contraPrueba";
  if (!req.headers.authorization) {
    res
      .status(403)
      .send({ message: "La petición no tiene cabecera de autentificación" });
  }
  //Solo quiero obtener el token del header, por eso lo reemplazo asi
  const token = req.headers.authorization.replace(/['"]+/g, "");

  //Obtenido el token, procedo a decodificarlo
  try {
    var payload = jwt.decode(token, SECRET_KEY);

    //Verifico si el token ya caduco
    if (payload.exp <= moment().unix()) {
      res.status(401).send({ message: "El token ha caducado" });
    }
  } catch (err) {
    //   console.log(err);
    return res.status(404).send({ message: "El token es invalido" });
  }
  req.user = payload;

  next();
};
