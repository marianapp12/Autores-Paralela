const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // UID de Firebase
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "empleado"], default: "empleado" } // Rol del usuario
});

module.exports = mongoose.model("User", UserSchema);
