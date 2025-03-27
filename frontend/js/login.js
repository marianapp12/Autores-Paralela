document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();
  
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Respuesta del servidor:", result);
      Swal.fire("Bienvenido", "Inicio de sesión exitoso", "success").then(() => {
        if (email === "admin@mail.com") {
          window.location.href = "../modules/manageAutors.html";
        } else {
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

