const express = require("express");
const router = express.Router();

// importar controladores
const { login, register, logout, getUsers } = require("../controllers/controladores");

// sesion
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

// usuario
router.get("/getUsers", getUsers);

// autor


// libro


module.exports = router;
