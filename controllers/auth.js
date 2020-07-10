const jwt = require("../services/jwt");
const User = require("../models/user");
const moment = require("moment");

//Verifico del lado del servidor si el token expiro
function willExpireToken(token) {
  const { exp } = jwt.decodedToken(token);
  const currentTime = moment().unix();

  if (currentTime > exp) {
    return true;
  }
  return false;
}

//Funcion para refrescar el access token
function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;

  const isTokenExpired = willExpireToken(refreshToken);

  if (isTokenExpired) {
    res.status(500).send({ message: "El token ha expirado" });
  } else {
    const { id } = jwt.decodedToken(refreshToken);

    User.findById(id, (err, userStored) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Ha ocurrido un error en el servidor" });
      } else {
        if (!userStored) {
          res.status(404).send({ message: "Usuario no encontrado" });
        } else {
          res.status(200).send({
            accessToken: jwt.createAccessToken(userStored),
            refreshToken: refreshToken,
            //Creo un nuevo accessToken y el refreshToken queda igual, por lo que si
            //el refresh expira, no se actualiza el access y entonces se desloguea de la cuenta
          });
        }
      }
    });
  }
}

module.exports = { refreshAccessToken };
