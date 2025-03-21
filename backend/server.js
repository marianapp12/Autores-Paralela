const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("../backend/routes/auth");
app.use("/", authRoutes);


app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Permite peticiones desde tu frontend
    credentials: true, // Permite enviar cookies/sesiones
  })
);