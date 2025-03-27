const mongoose = require('mongoose');

// Esquema de Autor
const AutorSchema = new mongoose.Schema({
    cedula: { type: String, required: true, unique: true },
    nombre_completo: { type: String, required: true},
    nacionalidad: { type: String, required: true },
    libros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }]
});

const Autor = mongoose.model('Autor', AutorSchema);

// Esquema de Libro
const LibroSchema = new mongoose.Schema({
    isbn: { type: String, required: true, unique: true },
    editorial: { type: String, required: true },
    genero: { type: String, required: true },
    anio_publicacion: { type: Number, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Autor', required: true }
});

const Libro = mongoose.model('Libro', LibroSchema);

module.exports = { Autor, Libro};
