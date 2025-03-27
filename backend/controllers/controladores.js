const { Autor, Libro, Usuario } = require("../schemas/esquemas.js"); //import del objecto user
const bcrypt = require("bcryptjs"); // Dependencia de npm para encriptar constraseñas

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

/* usuario */
const getUsers = async (req, res) => {
  try {
    const users = await Usuario.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUsers = async (req, res) => {
  const { username, password, tipo } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new Usuario({
      username,
      password: passwordHash,
      tipo,
    });

    const userSaved = await newUser.save();
    res.json(userSaved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateUsers = async (req, res) => {
  const { id } = req.params;
  const { username, password, tipo } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const userUpdated = await Usuario.findByIdAndUpdate(id, {
      username,
      password: passwordHash,
      tipo,
    });

    res.json(userUpdated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteUsers = async (req, res) => {
  const { id } = req.params;

  try {
    await Usuario.findByIdAndDelete(id);
    res.json({ message: "Usuario Eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/* autor */

const getAutores = async (req, res) => {
  try {
    const autores = await Autor.find().populate('libros');
    res.json(autores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createAutores = async (req, res) => {
  const { cedula, nombre_completo, nacionalidad } = req.body;

  try {
    const newAutor = new Autor({
      cedula,
      nombre_completo,
      nacionalidad,
    });

    const autorSaved = await newAutor.save();
    res.json(autorSaved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateAutores = async (req, res) => {
  const { id } = req.params;
  const { cedula, nombre_completo, nacionalidad } = req.body;

  try {
    const autorUpdated = await Autor.findByIdAndUpdate(
      id, 
      { cedula, nombre_completo, nacionalidad }, 
      { new: true } // ✅ Devuelve el documento actualizado
    );

    if (!autorUpdated) {
      return res.status(404).json({ message: "Autor not found" }); // ✅ Manejo de error si no se encuentra
    }

    res.json(autorUpdated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteAutores = async (req, res) => {
  const { id } = req.params;

  try {
    await Autor.findByIdAndDelete(id);
    res.json({ message: "Autor Eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/* libro */

const getLibros = async (req, res) => {
  try {
    const libros = await Libro.find().populate('autor');
    res.json(libros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createLibros = async (req, res) => {
  const { isbn, editorial, genero, anio_publicacion, autor } = req.body;

  try {
    const newLibro = new Libro({
      isbn,
      editorial,
      genero,
      anio_publicacion,
      autor,
    });

    const libroSaved = await newLibro.save();

    // Agregar el libro al autor
    const autorFound = await Autor.findById(autor);
    autorFound.libros.push(libroSaved);
    await autorFound.save();

    res.json(libroSaved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateLibros = async (req, res) => {
  const { id } = req.params;
  const { isbn, editorial, genero, anio_publicacion, autor } = req.body;

  try {
    const libroUpdated = await Libro.findByIdAndUpdate(id, {
      isbn,
      editorial,
      genero,
      anio_publicacion,
      autor,
    });

    res.json(libroUpdated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteLibros = async (req, res) => {
  const { id } = req.params;

  try {
    await Libro.findByIdAndDelete(id);
    res.json({ message: "Libro Eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// otros
const getAutorByCedula = async (req, res) => {

  const { cedula } = req.params;

  try {
    const autor = await Autor.findOne({ cedula }).populate('libros');
    res.json(autor);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getUserByUsername = async (req, res) => {

  const { username } = req.params;

  try {
    const user = await Usuario.findOne({ username });
    res.json(user);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { login, register, logout, getUsers, createUsers, updateUsers, deleteUsers, getAutores, createAutores, updateAutores, deleteAutores, getLibros, createLibros, updateLibros, deleteLibros, getAutorByCedula, getUserByUsername }; //Exportar funciones