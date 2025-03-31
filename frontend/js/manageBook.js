// inputs
const isbn = document.getElementById('floating-isbn');
const editorial = document.getElementById('floating-editorial');
const genero = document.getElementById('floating-genero');
const añoPublicacion = document.getElementById('floating-año-publicacion');
const autor = document.getElementById('floating-autor');

// buttons
const registerButton = document.getElementById('btnRegisterBook');

// validacion de campos
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

// create
registerButton.addEventListener('click', async function (event) {
    event.preventDefault();  // Evita que se envíe el formulario si el botón no tiene tipo submit
    const form = document.getElementById('register-form');

    // Verifica si el formulario es válido antes de proceder con el registro
    if (form.checkValidity()) {
        // Llama a la función para registrar el usuario
        await InsertBook();
    } else {
        form.classList.add('was-validated');  // Agrega la clase para mostrar los errores
    }
});

async function InsertBook() {

    let book = {
        isbn: isbn.value,
        editorial: editorial.value,
        genero: genero.value,
        anio_publicacion: añoPublicacion.value,
        autor: autor.value
    }

    try {
        const response = await fetch("http://localhost:3000/api/createLibros", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });

        if (!response.ok) {
            throw new Error('Network error: ' + response.statusText);
        }

        const data = await response.json();
        postAlert();

    } catch (error) {
        console.error('Error:', error);
        alert('There was no possible to register the book');
    }
}





// traer libros
async function getBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/getlibros');
        const data = await response.json();

        if (!response.ok) {
            console.error("Error: " + (data.error || "An error occurred"));
            getLibrosErrorAlert(data.error);
        }

        populateTable(data);
        collapse()
    } catch (error) {
        console.error("Error getting libros", error);
        getLibrosErrorAlert();
    }
}

function createTableRow(data) {

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.isbn}</td>
        <td>${data.editorial}</td>
        <td>${data.genero}</td>
        <td>${data.anio_publicacion}</td>
        <td>${data.autor.cedula}</td>

        <td>
            <p class="d-inline-flex gap-1">
                <button class="btn btn-outline-info btn-lg edit-btn" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseUpdateLibro" aria-expanded="false"
                    aria-controls="collapseUpdateLibro">
                    Edit
                </button>
            </p>
        </td>

        <td>
            <p class="d-inline-flex gap-1">
                <button class="btn btn-outline-danger btn-lg delete-btn" type="button" aria-expanded="false">
                    Delete
                </button>
            </p>
        </td>
    `;

    addEventListeners(data, row);

    return row;
}

function addEventListeners(data, row) {

    const editButton = row.querySelector('.edit-btn');
    editButton.addEventListener('click', () => populateForm(data));

    const deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => deleteCancelAlert(data));
}

function populateTable(data) {
    const id = 'tbody-update-libro';

    const tableBody = document.getElementById(id);
    tableBody.innerHTML = '';
    data.forEach((item, index) => {
        // el row debe tener todos los datos de data (campos del schema)
        const row = createTableRow({
            _id: item._id,
            isbn: item.isbn,
            editorial: item.editorial,
            genero: item.genero,
            anio_publicacion: item.anio_publicacion,
            autor: item.autor
        });
        tableBody.appendChild(row);
    });

}

// inputs for update
const inputIsbn2 = document.getElementById('isbn-update');
const inputEditorial2 = document.getElementById('editorial-update');
const inputGenero2 = document.getElementById('genero-update');
const inputAñoPublicacion2 = document.getElementById('año-publicacion-update');
const inputAutor2 = document.getElementById('autor-update');

// update
function populateForm(data) {

    inputIsbn2.value = data.isbn;
    inputEditorial2.value = data.editorial;
    inputGenero2.value = data.genero;
    inputAñoPublicacion2.value = data.anio_publicacion;
    inputAutor2.value = data.autor.cedula;  // revisar

    updateBook = {
        _id: data._id,
        isbn: data.isbn,
        editorial: data.editorial,
        genero: data.genero,
        anio_publicacion: data.anio_publicacion,
        autor: data.autor
    }

    addEventListener(updateBook);
}

function addEventListener(updateBook) {
    const editButton = document.getElementById('btn-update-submit');
    editButton.addEventListener('click', () => handlePutSubmit(updateBook));
}

async function handlePutSubmit(updateBook) {
    const putForm = document.getElementById('putForm');

    if (!putForm.checkValidity()) {
        putForm.classList.add('was-validated');
        return;
    }

    putLibro(updateBook);
}

async function putLibro(updateBook) {

    const _id = updateBook._id;

    try {
        const response = await fetch(`http://localhost:3000/api/updateLibros/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateBook)
        });

        const responseData = await response.json();

        if (response.ok) {
            putAlert(responseData.message);
        } else {
            console.error("Error: " + (responseData.error || "An error occurred"));
            putErrorAlert(responseData.error);
        }
    } catch (error) {
        console.error("Error updating Book", error);
        putErrorAlert();
    }
}





// delete
function handleDelete(data) {

    const deleteData = {};

    deleteData._id = data._id;

    deleteUser(deleteData)
}

async function deleteUser(deleteData) {
    try {
        const response = await fetch(`http://localhost:3000/api/deletelibros/${deleteData._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteData)
        });

        const responseData = await response.json();

        if (response.ok) {
            deleteAlert(responseData.message);
        } else {
            console.error("Error: " + (responseData.error || "An error occurred"));
            deleteErrorAlert(responseData.error);
        }
    } catch (error) {
        console.error('Error deleting book', error);
        deleteErrorAlert();
    }
}

// ALERTS

//// GET ALERTS

function getLibrosErrorAlert(message) {
    Swal.fire({
        icon: "error",
        title: message || "Error getting books",
        allowOutsideClick: false
    });
};

//// PUT ALERTS

function putAlert(message) {
    Swal.fire({
        icon: "success",
        title: message || "book has been updated",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            location.reload(true);
        }
    });
};

function putCancelAlert() {
    Swal.fire({
        title: "The update of a book was cancelled",
        allowOutsideClick: false
    });
};

function putErrorAlert(error) {
    Swal.fire({
        icon: "error",
        title: error || "Error updating book",
        allowOutsideClick: false
    });
};

//// DELETE ALERTS

function deleteAlert(message) {
    Swal.fire({
        icon: "success",
        title: message || "book has been deleted",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) { // Se ejecuta cuando el usuario hace clic en "OK" o confirma el diálogo
            location.reload(true);
        }
    });
};

function deleteCancelAlert(data) {
    Swal.fire({
        title: "Are you sure you want to delete the book?",
        showCancelButton: true,
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            handleDelete(data);
        };
    });
};

function deleteErrorAlert(error) {
    Swal.fire({
        icon: "error",
        title: error || "Error deleting book",
        allowOutsideClick: false
    });
};

// post

function postAlert() {
    Swal.fire({
        icon: "success",
        title: "book has been created"
    }).then((result) => {
        if (result.isConfirmed) {
            location.reload(true);
        }
    });
};

// evento collapse
document.addEventListener('DOMContentLoaded', function () {
    const collapseButtons = document.querySelectorAll('[data-bs-toggle="collapse"]');

    collapseButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Obtener el ID del colapso que se va a abrir
            const targetId = this.getAttribute('data-bs-target');

            // Cerrar otros colapsos
            collapseButtons.forEach(btn => {
                const otherTargetId = btn.getAttribute('data-bs-target');
                if (otherTargetId !== targetId) {
                    const collapseElement = document.querySelector(otherTargetId);
                    const collapse = bootstrap.Collapse.getInstance(collapseElement);
                    if (collapse) {
                        collapse.hide(); // Cerrar el colapso
                    }
                }
            });
        });
    });
});

// funcion collapse (para el form update)
function collapse() {
    const collapseButtons = document.querySelectorAll('[data-bs-toggle="collapse"]');

    collapseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-bs-target');

            collapseButtons.forEach(btn => {
                const otherTargetId = btn.getAttribute('data-bs-target');
                if (otherTargetId !== targetId) {
                    const collapseElement = document.querySelector(otherTargetId);
                    const collapse = bootstrap.Collapse.getInstance(collapseElement);
                    if (collapse) {
                        collapse.hide();
                    }
                }
            });
        });
    });
}