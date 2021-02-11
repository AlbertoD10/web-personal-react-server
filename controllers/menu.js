const Menu = require("../models/menu");

function addMenu(req, res) {
  const { title, url, order, active } = req.body;
  const menu = new Menu();
  menu.title = title;
  menu.url = url;
  menu.order = order;
  menu.active = active;

  menu.save((err, menuCreated) => {
    if (err) {
      res.status(500).send({ message: "Esta url ya existe" });
    } else {
      if (!menuCreated) {
        res.status(404).send({ message: "Error al crear el menu" });
      } else {
        res
          .status(200)
          .send({ message: "Menu creado correctamente", status: 200 });
      }
    }
  });
}

function getMenu(req, res) {
  Menu.find({})
    .sort({ order: "asc" })
    .exec((err, allMenus) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Ha ocurrido un error en el servidor" });
      } else {
        if (!allMenus) {
          res.status(404).send({ message: "Menus no encontrados" });
        } else {
          res.status(200).send({ menu: allMenus, status: 200 });
        }
      }
    });
}

function updateMenu(req, res) {
  const params = req.params;
  let menuData = req.body;

  Menu.findByIdAndUpdate(params.id, menuData, (err, menuUpdate) => {
    if (err) {
      res.status(500).send({ message: "Esta url ya existe." });
    } else {
      if (!menuUpdate) {
        res.status(404).send({ message: "No se ha encontrado ningun menu." });
      } else {
        res
          .status(200)
          .send({ message: "Menu actualizado correctamente.", status: 200 });
      }
    }
  });
}

function deleteMenu(req, res) {
  const { id } = req.params;

  console.log(id);

  Menu.findByIdAndRemove(id, (err, menuDeleted) => {
    if (err) {
      res.status(500).send({ message: "Ha ocurrido un error en el servidor" });
    } else {
      if (!menuDeleted) {
        res.status(404).send({ message: "Menu no encontrado" });
      } else {
        res.status(200).send({ message: "Menu eliminado" });
      }
    }
  });
}

module.exports = { addMenu, getMenu, updateMenu, deleteMenu };
