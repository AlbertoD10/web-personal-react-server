const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "contraPrueba";

//Creo el token de acceso
exports.createAccessToken = function (user) {
  const payload = {
    id: user._id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    createToken: moment().unix(),
    exp: moment().add(3, "hours").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};

//Reinicia el accessToken siempre y cuando este activo
exports.createRefreshToken = function (user) {
  const payload = {
    id: user._id,
    exp: moment().add(30, "days").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};

//Decodificador del token

exports.decodedToken = function (token) {
  return jwt.decode(token, SECRET_KEY, true);
};

module.exports = { SECRET_KEY };
