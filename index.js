//Hago la conexion con la base de datos
const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977; //Para indicar al server en que puerto ejecutarse
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

//Creo la BD dentro de mongodb
mongoose.set("useCreateIndex", true);
mongoose.connect(
  `mongodb://${IP_SERVER}:${PORT_DB}/mydatabase`, //Puerto donde corre la DB
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("La conexion con la base de datos es correcta");

      app.listen(port, () => {
        console.log("------API REST-------");
        console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`); //Puerto donde corre el servidor
      });
    }
  }
);
