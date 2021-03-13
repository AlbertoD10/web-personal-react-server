const NewsLetter = require("../models/newsletter");

function suscribeEmail(req, res) {
  const email = req.params.email;
  const newsletter = NewsLetter();

  if (!email) {
    res.status(404).send({ status: 404, message: "Email obligatorio" });
  } else {
    newsletter.email = email.toLowerCase();

    newsletter.save((err, newsLetterStored) => {
      if (err) {
        res
          .status(500)
          .send({ status: 500, message: "El email ya esta registrado" });
      } else {
        if (!newsLetterStored) {
          res
            .status(400)
            .send({ status: 400, message: "Error al registrar el email" });
        } else {
          res
            .status(200)
            .send({ status: 200, message: "Email registrado correctamente." });
        }
      }
    });
  }
}

module.exports = {
  suscribeEmail,
};
