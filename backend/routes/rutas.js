const express = require("express");
const router = express.Router();

// importar controladores
const { login, register, logout, getUsers, getEmployees, getAdmins } = require("../controllers/controladores");

// sesion
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/getUsers", getUsers);

// empleados
router.get("/getEmployees", getEmployees);

// administradores
router.get("/getAdmins", getAdmins);

module.exports = router;
