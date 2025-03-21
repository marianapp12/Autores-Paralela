const express = require("express");
const router = express.Router();
const { auth, signIn } = require("../database/firebase");

// Ruta para manejar el login
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

router.post("/logout", async (req, res) => {
  res.clearCookie("token"); // Si usas cookies
  res.json({ message: "Sesión cerrada correctamente" });
});


module.exports = router;
