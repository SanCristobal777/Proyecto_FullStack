/* =========================================================
   formularios.js - Registro, Inicio de sesión, Contacto y Newsletter
   ========================================================= */

/* ---------- Registro de usuario (R.6) ---------- */
function iniciarRegistro() {
  const form = document.getElementById("form-registro");
  enlazarRegionComuna(document.getElementById("region"), document.getElementById("comuna"));

  const reglas = {
    ...reglasUsuario(),
    password: [requerido("Ingresa la contraseña."), largoEntre(4, 10, "La contraseña")],
    password2: [requerido("Repite la contraseña."), igualA("password", "Las contraseñas no coinciden.")]
  };

  // Si cambia la contraseña, se vuelve a revisar la confirmación
  document.getElementById("password").addEventListener("input", () => {
    const confirmacion = document.getElementById("password2");
    if (confirmacion.value) validarCampo(confirmacion, reglas.password2);
  });

  conectarFormulario(form, reglas, (datos) => {
    const usuarios = obtenerUsuarios();
    usuarios.push({
      run: datos.run.toUpperCase(),
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      correo: datos.correo.toLowerCase(),
      fechaNacimiento: datos.fechaNacimiento || "",
      tipo: "Cliente", // desde la tienda siempre se crea un Cliente
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion,
      password: datos.password
    });
    guardarUsuarios(usuarios);
    limpiarFormulario(form);
    document.getElementById("resultado").innerHTML =
      '<div class="alert alert-success">Cuenta creada. Te llevamos a iniciar sesión…</div>';
    setTimeout(() => { window.location.href = "login.html"; }, 1500);
  });
}

/* ---------- Inicio de sesión (R.7) ---------- */
function iniciarLogin() {
  const form = document.getElementById("form-login");
  const reglas = {
    correo: [requerido("Ingresa el correo."), maxLargo(100), correoPermitido],
    password: [requerido("Ingresa la contraseña."), largoEntre(4, 10, "La contraseña")]
  };

  conectarFormulario(form, reglas, (datos) => {
    const usuario = obtenerUsuarios().find(u => u.correo === datos.correo.toLowerCase() && u.password === datos.password);
    const resultado = document.getElementById("resultado");
    if (!usuario) {
      resultado.innerHTML = '<div class="alert alert-danger">Correo o contraseña incorrectos.</div>';
      return;
    }
    iniciarSesion(usuario);
    resultado.innerHTML = `<div class="alert alert-success">Bienvenido/a, ${usuario.nombre}.</div>`;
    // Administrador y Vendedor van al panel; Cliente vuelve a la tienda (R.18)
    const destino = usuario.tipo === "Cliente" ? "index.html" : "admin/index.html";
    setTimeout(() => { window.location.href = destino; }, 800);
  });
}

/* ---------- Contacto (R.8) ---------- */
function iniciarContacto() {
  const form = document.getElementById("form-contacto");
  const reglas = {
    nombreContacto: [requerido("Ingresa el nombre."), maxLargo(100)],
    correoContacto: [maxLargo(100), correoPermitido],
    comentario: [requerido("Escribe tu comentario."), maxLargo(500)]
  };

  // Si hay sesión, se completan nombre y correo
  const sesion = obtenerSesion();
  if (sesion) {
    document.getElementById("nombreContacto").value = `${sesion.nombre} ${sesion.apellidos}`;
    document.getElementById("correoContacto").value = sesion.correo;
  }

  conectarFormulario(form, reglas, (datos) => {
    const mensajes = leer(CLAVES.mensajes, []);
    mensajes.push({ ...datos, fecha: new Date().toISOString() });
    guardar(CLAVES.mensajes, mensajes);
    limpiarFormulario(form);
    document.getElementById("resultado").innerHTML =
      '<div class="alert alert-success">Mensaje enviado. Te responderemos dentro de 48 horas hábiles.</div>';
  });
}

/* ---------- Newsletter del footer ---------- */
function iniciarNewsletter() {
  const form = document.getElementById("form-newsletter");
  if (!form) return;
  conectarFormulario(form, { correoNews: [requerido("Ingresa el correo."), correoPermitido] }, () => {
    limpiarFormulario(form);
    avisar("Listo, te avisaremos de las ofertas.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const paginas = { registro: iniciarRegistro, login: iniciarLogin, contacto: iniciarContacto };
  const iniciar = paginas[document.body.dataset.pagina];
  if (iniciar) iniciar();
  iniciarNewsletter();
});
