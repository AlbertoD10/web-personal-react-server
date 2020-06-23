const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Modelo de nuestro usuario
const UserSchema = Schema({
  name: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: String,
  active: Boolean,
});

module.exports = mongoose.model("User", UserSchema);
