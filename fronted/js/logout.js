document.getElementById("logoutButton").addEventListener("click", async function (event) {
  event.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
    });

    if (response.ok) {
      localStorage.removeItem("token");
      sessionStorage.clear();
      Swal.fire("Sesión cerrada", "Has cerrado sesión correctamente", "info").then(() => {
        window.location.href = "../modules/login.html";
      });
    } else {
      Swal.fire("Error", "No se pudo cerrar la sesión", "error");
    }
  } catch (error) {
    Swal.fire("Error", "No se pudo conectar con el servidor", "error");
  }
});
