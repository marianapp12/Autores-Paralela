const express = require("express");
const router = express.Router();

// importar controladores
const { login, register, logout, getUsers, createUsers, updateUsers, deleteUsers, getAutores, createAutores, updateAutores, deleteAutores, getLibros, createLibros, updateLibros, deleteLibros } = require("../controllers/controladores");

/* Rutas */

// sesion
router.post("/login", login);
router.post("/register", register);
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

module.exports = router;
