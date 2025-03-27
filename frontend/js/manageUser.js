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

// control collapse
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


// collapse 2 (para el manage user)
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



// VARIABLES

//// PUT VARIABLES
const putName = document.getElementById('name-update');
const putSpecies = document.getElementById('select-species-update');
const putAge = document.getElementById('age-update');
const putWeight = document.getElementById('weight-update');
const putPhoto = document.getElementById('photo-update');



// LOGIC

//// GET LOGIC

async function getUsersByUserOwner() {
    try {
        const response = await fetch('/getUsersByUserOwner');
        const data = await response.json();

        if (!response.ok) {
            console.error("Error: " + (data.error || "An error occurred"));
            getUsersByUserOwnerErrorAlert(data.error);
        }

        populateTable(data);
        collapse();
    } catch (error) {
        console.error("Error getting Users and user owners", error);
        getUsersByUserOwnerErrorAlert();
    }
}

function createTableRow(data) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <th scope="row">${data.User_id}</th>
        <td>${data.name}</td>
        <td>${data.species}</td>
        <td>${data.age}</td>
        <td>${data.weight}</td>
        <td>
            <p class="d-inline-flex gap-1">
                ${data.photo_url
            ? `<img src="${data.photo_url}" class="img-thumbnail" alt="user photo" style="max-width: 100px;">`
            : `<img src="https://res.cloudinary.com/dieprtgzj/image/upload/v1734023704/User_silhouette_ww3w2l.jpg" class="img-thumbnail" alt="user photo" style="max-width: 100px;">`
        }
            </p>
        </td>
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
    const editButton = row.querySelector('.edit-btn');
    editButton.addEventListener('click', () => populateForm(data));
    const deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => deleteCancelAlert(data));
}

function populateTable(data) {
    const id = 'tbody-update-user';

    const tableBody = document.getElementById(id);
    tableBody.innerHTML = '';
    data.forEach((item, index) => {
        const row = createTableRow({
            User_id: item.User_id,
            name: item.name,
            species: item.species,
            age: item.age,
            weight: item.weight,
            photo_url: item.photo_url
        });
        tableBody.appendChild(row);
    });
}



//// UPDATE LOGIC

function populateForm(data) {
    putName.value = data.name;
    putSpecies.value = data.species;
    putAge.value = data.age;
    putWeight.value = data.weight;

    var putFormData = new FormData();

    putFormData.append('User_id', data.User_id);
    putFormData.append('oldName', data.name);
    putFormData.append('photo_url', data.photo_url);

    addEventListener(putFormData);
}

function addEventListener(putFormData) {
    const editButton = document.getElementById('btn-update-submit');
    editButton.addEventListener('click', () => handlePutSubmit(putFormData));
}

async function handlePutSubmit(putFormData) {
    const putForm = document.getElementById('putForm');

    if (!putForm.checkValidity()) {
        putForm.classList.add('was-validated');
        return;
    }

    putFormData.append('name', putName.value);
    putFormData.append('species', putSpecies.value);
    putFormData.append('age', putAge.value);
    putFormData.append('weight', putWeight.value);
    putFormData.append('photo', putPhoto.files[0]); // Properly append the file

    putUser(putFormData);
}

async function putUser(putFormData) {
    try {
        const response = await fetch('/putUser', {
            method: 'PUT',
            body: putFormData
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



//// DELETE LOGIC

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

function getUsersByUserOwnerErrorAlert(message) {
    Swal.fire({
        icon: "error",
        title: message || "Error getting Users and user owners",
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
