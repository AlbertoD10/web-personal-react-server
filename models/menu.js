const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Modelo del menu de de paginas

const MenuSchema = Schema({
  title: String,
  url: {
    type: String,
    unique: true,
  },
  order: String,
  active: Boolean,
});

module.exports = mongoose.model("Menu", MenuSchema);
