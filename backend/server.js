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
