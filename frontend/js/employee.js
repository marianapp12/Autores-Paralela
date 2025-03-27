// select
const selectCedulas = document.getElementById('select-cedulas');

// buttons
const btnCollapseVisualize = document.getElementById('btn-collapse-visualize-author');

// events
btnCollapseVisualize.addEventListener('click', () => {
    loadCedulas();
});

selectCedulas.addEventListener('change', () => {
    visualizeAuthors();
});

// funcion para cargar las cedulas en el select
function loadCedulas() {
    const url = "http://localhost:3000/api/getCedulas";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data) {
                selectCedulas.innerHTML = '';
                selectCedulas.innerHTML = `<option disabled selected="selected">Cedula</option>`;
                data.forEach(author => {
                    selectCedulas.innerHTML += `
                        <option value="${author.cedula}">${author.cedula}</option>
                    `;
                });
            }
        })
        .catch(error => {
            console.error(error);
            getAuthorsErrorAlert();
        });
}

// funcion para visualizar los autores segun la cedula
function visualizeAuthors() {
    const authorId = selectCedulas.options[selectCedulas.selectedIndex].value;
    const url = `http://localhost:3000/api/getAutorByCedula/${authorId}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data) {
                const authorsTable = document.getElementById('tbody-update-autor');
                authorsTable.innerHTML = '';
                
                // Asumiendo que data es un objeto con la información del autor y sus libros
                authorsTable.innerHTML += `
                    <tr>
                        <td>${data._id}</td>
                        <td>${data.nombre_completo}</td>
                        <td>${data.cedula}</td>
                        <td>${data.nacionalidad}</td>
                        <td>${data.libros.map(libro => libro.isbn).join(', ')}</td>
                    </tr>
                `;
            }
        })
        .catch(error => {
            console.error(error);
            getAuthorsErrorAlert();
        });
}

// get alert

function getAuthorsErrorAlert(message) {
    Swal.fire({
        icon: "error",
        title: message || "Error getting author",
        allowOutsideClick: false
    });
};
