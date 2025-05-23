// inputs

const inputNombreCompleto = document.getElementById('floating-nombre-completo');
const inputCedula = document.getElementById('floating-cedula');
const inputNacionalidad = document.getElementById('floating-nacionalidad');

// buttons
const registerButton = document.getElementById('btnRegisterAutor');

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
        await InsertAutor();
    } else {
        form.classList.add('was-validated');  // Agrega la clase para mostrar los errores
    }
});

async function InsertAutor() {

    let autor = {
        cedula: inputCedula.value,
        nombre_completo: inputNombreCompleto.value,
        nacionalidad: inputNacionalidad.value
    }

    try {
        const response = await fetch("http://localhost:3000/api/createAutores", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(autor)
        });

        if (!response.ok) {
            throw new Error('Network error: ' + response.statusText);
        }

        const data = await response.json();
        postAlert();

    } catch (error) {
        console.error('Error:', error);
        alert('There was no possible to register the autor');
    }
}





// traer autores
async function getAuthors() {
    try {
        const response = await fetch('http://localhost:3000/api/getAutores');
        const data = await response.json();

        if (!response.ok) {
            console.error("Error: " + (data.error || "An error occurred"));
            getAutorsErrorAlert(data.error);
        }

        populateTable(data);
        collapse()
    } catch (error) {
        console.error("Error getting autores", error);
        getAutorsErrorAlert();
    }
}

function createTableRow(data) {

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.nombre_completo}</td>
        <td>${data.cedula}</td>
        <td>${data.nacionalidad}</td>
        <td>${data.libros.length}</td>

        <td>
            <p class="d-inline-flex gap-1">
                <button class="btn btn-outline-info btn-lg edit-btn" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseUpdateAutor" aria-expanded="false"
                    aria-controls="collapseUpdateAutor">
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
    const id = 'tbody-update-autor';

    const tableBody = document.getElementById(id);
    tableBody.innerHTML = '';
    data.forEach((item, index) => {
        // el row debe tener todos los datos de data (campos del schema)
        const row = createTableRow({
            _id: item._id,
            cedula: item.cedula,
            nombre_completo: item.nombre_completo,
            nacionalidad: item.nacionalidad,
            libros: item.libros
        });
        tableBody.appendChild(row);
    });

}




// inputs for update
const inputCedula2 = document.getElementById('cedula-update');
const inputNombreCompleto2 = document.getElementById('nombre-completo-update');
const inputNacionalidad2 = document.getElementById('nacionalidad-update');

// update
function populateForm(data) {

    inputCedula2.value = data.cedula;
    inputNombreCompleto2.value = data.nombre_completo;
    inputNacionalidad2.value = data.nacionalidad;

    updateAutor = {
        _id: data._id,
        cedula: data.cedula,
        nombre_completo: data.nombre_completo,
        nacionalidad: data.nacionalidad
    }

    addEventListener(updateAutor);
}

function addEventListener(updateAutor) {
    const editButton = document.getElementById('btn-update-submit');
    editButton.addEventListener('click', () => handlePutSubmit(updateAutor));
}

async function handlePutSubmit(updateAutor) {
    const putForm = document.getElementById('putForm');

    if (!putForm.checkValidity()) {
        putForm.classList.add('was-validated');
        return;
    }

    putAutor(updateAutor);
}

async function putAutor(updateAutor) {

    const _id = updateAutor._id;

    try {
        const response = await fetch(`http://localhost:3000/api/updateAutores/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateAutor)
        });

        const responseData = await response.json();

        if (response.ok) {
            putAlert(responseData.message);
        } else {
            console.error("Error: " + (responseData.error || "An error occurred"));
            putErrorAlert(responseData.error);
        }
    } catch (error) {
        console.error("Error updating Autor", error);
        putErrorAlert();
    }
}





// delete
function handleDelete(data) {

    const deleteData = {};

    deleteData._id = data._id;

    deleteAuthor(deleteData)
}

async function deleteAuthor(deleteData) {
    try {
        const response = await fetch(`http://localhost:3000/api/deleteAutores/${deleteData._id}`, {
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
        console.error('Error deleting author', error);
        deleteErrorAlert();
    }
}


// ALERTS

//// GET ALERTS

function getAutorsErrorAlert(message) {
    Swal.fire({
        icon: "error",
        title: message || "Error getting athors",
        allowOutsideClick: false
    });
};

//// PUT ALERTS

function putAlert(message) {
    Swal.fire({
        icon: "success",
        title: message || "author has been updated",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            location.reload(true);
        }
    });
};

function putCancelAlert() {
    Swal.fire({
        title: "The update of a author was cancelled",
        allowOutsideClick: false
    });
};

function putErrorAlert(error) {
    Swal.fire({
        icon: "error",
        title: error || "Error updating author",
        allowOutsideClick: false
    });
};

//// DELETE ALERTS

function deleteAlert(message) {
    Swal.fire({
        icon: "success",
        title: message || "author has been deleted",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) { // Se ejecuta cuando el usuario hace clic en "OK" o confirma el diálogo
            location.reload(true);
        }
    });
};

function deleteCancelAlert(data) {
    Swal.fire({
        title: "Are you sure you want to delete the author?",
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
        title: error || "Error deleting author",
        allowOutsideClick: false
    });
};

// post

function postAlert() {
    Swal.fire({
        icon: "success",
        title: "author has been created"
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