// inputs
const inputName = document.getElementById('floatingUsername');
const inputPassword = document.getElementById('floatingPassword');
const selectRole = document.getElementById('select-role');

// buttons
const registerButton = document.getElementById('btnRegisterUser');

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
        await InsertUser();
    } else {
        form.classList.add('was-validated');  // Agrega la clase para mostrar los errores
    }
});

async function InsertUser() {

    let user = {
        username: inputName.value,
        password: inputPassword.value,
        tipo: selectRole.options[selectRole.selectedIndex].text
    }

    try {
        const response = await fetch("http://localhost:3000/api/createUsers", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error('Network error: ' + response.statusText);
        }

        const data = await response.json();
        console.log(data);
        postAlert();

    } catch (error) {
        console.error('Error:', error);
        alert('There was no possible to register the user');
    }
}

// traer usuarios
async function getUsers() {
    try {
        const response = await fetch('http://localhost:3000/api/getUsers');
        const data = await response.json();

        console.log("Datos recibidos en data de getUsers:", data)

        if (!response.ok) {
            console.error("Error: " + (data.error || "An error occurred"));
            getUsersErrorAlert(data.error);
        }

        populateTable(data);
        collapse()
    } catch (error) {
        console.error("Error getting Users", error);
        getUsersErrorAlert();
    }
}

function createTableRow(data) {

    console.log("Datos recibidos en createTableRow:", data)

    const row = document.createElement('tr');
    row.innerHTML = `
        <th scope="row">${data._id}</th>
        <td>${data.username}</td>
        <td>${data.tipo}</td>

        <td>
            <p class="d-inline-flex gap-1">
                <button class="btn btn-outline-info btn-lg edit-btn" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseUpdateUser" aria-expanded="false"
                    aria-controls="collapseUpdateUser">
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

    console.log("Datos recibidos en addEventListeners:", data)

    const editButton = row.querySelector('.edit-btn');
    editButton.addEventListener('click', () => populateForm(data));

    const deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => deleteCancelAlert(data));
}

function populateTable(data) {
    const id = 'tbody-update-user';

    console.log("Datos recibidos en populateTable:", data)

    const tableBody = document.getElementById(id);
    tableBody.innerHTML = '';
    data.forEach((item, index) => {
        // el row debe tener todos los datos de data (campos del schema)
        const row = createTableRow({
            _id: item._id,
            username: item.username,
            password: item.password,
            tipo: item.tipo,
        });
        tableBody.appendChild(row);
    });

    console.log("Datos al final de populateTable:", data)
}

// inputs for update
const inputName2 = document.getElementById('username-update');
const inputPassword2 = document.getElementById('password-update');
const selectRole2 = document.getElementById('role-update');

// update
function populateForm(data) {

    console.log("Datos recibidos en populateForm:", data)

    inputName2.value = data.username;
    inputPassword2.value = data.password;
    selectRole2.value = data.tipo;

    updateUser = {
        _id: data._id,
        username: data.username,
        password: data.password,
        tipo: data.tipo
    }

    addEventListener(updateUser);
}

function addEventListener(updateUser) {
    const editButton = document.getElementById('btn-update-submit');
    editButton.addEventListener('click', () => handlePutSubmit(updateUser));
}

async function handlePutSubmit(updateUser) {
    const putForm = document.getElementById('putForm');

    if (!putForm.checkValidity()) {
        putForm.classList.add('was-validated');
        return;
    }

    putUser(updateUser);
}

async function putUser(updateUser) {

    console.log("Enviando datos al servidor:", updateUser)

    const _id = updateUser._id;

    console.log("Datos enviados al servidor:", updateUser);

    try {
        const response = await fetch(`http://localhost:3000/api/updateUsers/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateUser)
        });

        const responseData = await response.json();

        if (response.ok) {
            putAlert(responseData.message);
        } else {
            console.error("Error: " + (responseData.error || "An error occurred"));
            putErrorAlert(responseData.error);
        }
    } catch (error) {
        console.error("Error updating user", error);
        putErrorAlert();
    }
}






// delete

function handleDelete(data) {
    const deleteData = {};

    deleteData.User_id = data.User_id;
    deleteData.name = data.name;
    deleteData.flag = data.photo_url || false;

    deleteUser(deleteData)
}

async function deleteUser(deleteData) {
    try {
        const response = await fetch('/deleteUser', {
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
        console.error('Error deleting user', error);
        deleteErrorAlert();
    }
}



// ALERTS

//// GET ALERTS

function getUsersErrorAlert(message) {
    Swal.fire({
        icon: "error",
        title: message || "Error getting Users",
        allowOutsideClick: false
    });
};

//// PUT ALERTS

function putAlert(message) {
    Swal.fire({
        icon: "success",
        title: message || "user has been updated",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            location.reload(true);
        }
    });
};

function putCancelAlert() {
    Swal.fire({
        title: "The update of a user was cancelled",
        allowOutsideClick: false
    });
};

function putErrorAlert(error) {
    Swal.fire({
        icon: "error",
        title: error || "Error updating user",
        allowOutsideClick: false
    });
};

//// DELETE ALERTS

function deleteAlert(message) {
    Swal.fire({
        icon: "success",
        title: message || "user has been deleted",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) { // Se ejecuta cuando el usuario hace clic en "OK" o confirma el diálogo
            location.reload(true);
        }
    });
};

function deleteCancelAlert(data) {
    Swal.fire({
        title: "Are you sure you want to delete the user?",
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
        title: error || "Error deleting user",
        allowOutsideClick: false
    });
};

// post

function postAlert() {
    Swal.fire({
        icon: "success",
        title: "user has been created"
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