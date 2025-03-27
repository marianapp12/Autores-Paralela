document.getElementById("loginForm").addEventListener("submit", async function (event) {

  event.preventDefault();
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  async function GetUserTipo() {

    try {
      const response2 = await fetch(`http://localhost:3000/api/getUserByUsername/${username}`);
      const user = await response2.json();

      if (response2.ok) {
        console.log("Respuesta del servidor:", user);
      }

      return user.tipo;
    } catch (error) {
      console.log("Error al obtener datos del usuario:", error
      );
    }
  }

  // iniciar sesion
  try {

    // iniciar sesion
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    const tipo = await GetUserTipo();

    if (response.ok) {
      console.log("Respuesta del servidor:", result);

      Swal.fire("Bienvenido", "Inicio de sesión exitoso", "success").then(() => {
        if (tipo === "admin") {
          console.log("Redirigiendo a la pagina del administrador...");
          window.location.href = "../modules/manageUsers.html";
        } else {
          console.log("Redirigiendo a la pagina del empleado");
          window.location.href = "../modules/employeeDashboard.html";
        }
      });

    } else {
      Swal.fire("Error", result.message, "error");
    }
  } catch (error) {
    Swal.fire("Error", "No se pudo conectar con el servidor", "error");
  }
});
