// const express = require("express");
// const router = express.Router();
// const { auth, signIn } = require("../database/firebase");

// // Ruta para manejar el login
// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const userCredential = await signIn(auth, username, password);
//     const user = userCredential.user;

//     return res.json({
//       message: "Inicio de sesión exitoso",
//       user: {
//         uid: user.uid,
//         username: user.username,
//       },
//     });
//   } catch (error) {
//     return res.status(400).json({ message: "Error en autenticación", error: error.message });
//   }
// });

// // ruta para el logout
// router.post("/logout", async (req, res) => {
//   res.clearCookie("token"); // Si usas cookies
//   res.json({ message: "Sesión cerrada correctamente" });
// });

// // ruta para el registro
// router.post("/register", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const userCredential = await createUser(auth, username, password);
//     const user = userCredential.user;

//     return res.json({
//       message: "Usuario creado exitosamente",
//       user: {
//         uid: user.uid,
//         username: user.username,
//       },
//     });
//   } catch (error) {
//     return res.status(400).json({ message: "Error en registro", error: error.message });
//   }
// });

// module.exports = router;
