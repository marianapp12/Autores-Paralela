document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Respuesta del servidor:", result);
      Swal.fire("Bienvenido", "Inicio de sesión exitoso", "success").then(() => {
        if (username === "admin@mail.com") {
          console.log("Redirigiendo a adminDashboard.html...");
          window.location.href = "../modules/mainDashboard.html";
        } else {
          console.log("Redirigiendo a employeeDashboard.html...");
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
