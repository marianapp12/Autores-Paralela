const { Autor, Libro, Usuario } = require ("../schemas/esquemas.js"); //import del objecto user
const bcrypt = require ("bcryptjs"); // Dependencia de npm para encriptar constraseñas

// import { createAccessToken } from "../libs/jwt.js"; // import del token

/* sesion */
const register = async (req, res) => {
  //Funcion para Crear,Guardar  el usuario
  const { username, password, tipo } = req.body; //requerimientos

  try {
    const passwordHash = await bcrypt.hash(password, 10); //Encriptar contraseña

    const newUser = new Usuario({
      //Crear Usuario
      username,
      password: passwordHash,
      tipo,
    });

    const userSaved = await newUser.save(); //Guardar usuario
    // const token = await createAccessToken({ id: userSaved.id }); //Creacion del Token
    // res.cookie("token", token, {
    //   httpOnly: true,
    // });

    res.json({
      // Respuesta del servidor de los parametros del usuario
      id: userSaved.id,
      username: userSaved.username,
      tipo: userSaved.tipo,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {

  //Funcion para Verificar el login,contraseña del usuario
  const { username, password } = req.body;

  try {
    const userFound = await Usuario.findOne({ username }); // Encontrar Usuario Registrado
    if (!userFound)
      return res.status(400).json({ message: "Usuario no Encontrado" }); // Si no lo encontro muestra mensaje

    const isMatch = await bcrypt.compare(password, userFound.password); // validar contraseña
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" }); // Mensaje de contraseña incorrecta

    // const token = await createAccessToken({ id: userFound.id }); //Creacion del Token con ese ID
    // res.cookie("token", token, {
    //   httpOnly: true,
    // });

    res.json({
      id: userFound.id,
      username: userFound.username,
      tipo: userFound.tipo,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Funcion para salir del programa
const logout = (req, res) => {
  // eliminar cookie
//   res.clearCookie("token")

  // Redirigir al usuario a la página de login después de hacer logout
  return res.redirect("../../frontend/modules/login.html");
};

// funcion para ver los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await Usuario.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// funcion para ver los empleados
const getEmployees = async (req, res) => {
  try {
    const employees = await Usuario.find({ tipo: "empleado" });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// funcion para ver los administradores
const getAdmins = async (req, res) => {
  try {
    const admins = await Usuario.find({ tipo: "admin" });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login, register, logout, getUsers, getEmployees, getAdmins }; //Exportar funciones