const express = require("express");
const User = require("../schemas/User");
const router = express.Router();

// importar controladores
const { login, logout, getUsers, createUsers, updateUsers, deleteUsers, getAutores, createAutores, updateAutores, deleteAutores, getLibros, createLibros, updateLibros, deleteLibros, getAutorByCedula, getUserByUsername } = require("../controllers/controladores");

/* Rutas */

// sesion
router.post("/login", login);
router.post("/logout", logout);

// usuario
router.get("/getUsers", getUsers);
router.post("/createUsers", createUsers);
router.put("/updateUsers/:id", updateUsers);
router.delete("/deleteUsers/:id", deleteUsers);

// autor
router.get("/getAutores", getAutores);
router.post("/createAutores", createAutores);
router.put("/updateAutores/:id", updateAutores);
router.delete("/deleteAutores/:id", deleteAutores);

// libro
router.get("/getLibros", getLibros);
router.post("/createLibros", createLibros);
router.put("/updateLibros/:id", updateLibros);
router.delete("/deleteLibros/:id", deleteLibros);

// otros
router.get("/getAutorByCedula/:cedula", getAutorByCedula);
router.get("/getUserByUsername/:username", getUserByUsername);

router.get("/getUserByUid/:uid", async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
