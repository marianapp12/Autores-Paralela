const express = require("express");
const app = express();
const path = require("path");

// añadir fetch y configurarlo globalmente
const fetch = require('node-fetch')
global.fetch = fetch;
global.Headers = fetch.Headers;
global.Response = fetch.Response;

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // incluir los archivos del frontend

// incluir rutas
const authRoutes = require("../backend/routes/auth");
app.use("/", authRoutes);

// iniciar el servidor con la pagina de login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/modules/login.html"));
});

// iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
