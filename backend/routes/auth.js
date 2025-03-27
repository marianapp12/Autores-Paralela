const express = require("express");
const { auth, signIn  } = require("../database/firebase");
const router = express.Router();

// Inicio de sesión
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const userCredential = await signIn(auth, email, password);
      const user = userCredential.user;
  
      return res.json({
        message: "Inicio de sesión exitoso",
        user: {
          uid: user.uid,
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(400).json({ message: "Error en autenticación", error: error.message });
    }
  });

// Cerrar sesión
router.post("/logout", (req, res) => {
    res.clearCookie("token"); // Si usas JWT en cookies
    res.json({ success: true, message: "Sesión cerrada correctamente" });
  });

module.exports = router;