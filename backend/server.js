const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth.js");  // 👈 Asegúrate de que esta ruta es correcta
app.use("/", authRoutes);  // 👈 Aquí se registran las rutas

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

const path = require("path");

// conexion a la bd Mongo
const { connect } = require("../backend/database/mongo");
connect();

// añadir fetch y configurarlo globalmente
const fetch = require('node-fetch')
global.fetch = fetch;
global.Headers = fetch.Headers;
global.Response = fetch.Response;

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // incluir los archivos del frontend

// incluir rutas
const rutas = require("../backend/routes/rutas");
app.use("/api", rutas);

// iniciar el servidor con la pagina de login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/modules/login.html"));
});

