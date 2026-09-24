/* =========================================================
   validaciones.js - Reglas de negocio y validación en tiempo real
   Cada regla recibe el valor y devuelve "" si está bien,
   o el mensaje de error si está mal.
   ========================================================= */

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

/* ---------- Reglas básicas ---------- */
const requerido = (mensaje) => (v) => v.trim() === "" ? mensaje : "";
const maxLargo = (n) => (v) => v.trim().length > n ? `Máximo ${n} caracteres (llevas ${v.trim().length}).` : "";
const minLargo = (n) => (v) => v.trim() !== "" && v.trim().length < n ? `Mínimo ${n} caracteres.` : "";

function correoPermitido(v) {
  const correo = v.trim().toLowerCase();
  if (correo === "") return "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return "Escribe un correo válido, por ejemplo nombre@duoc.cl.";
  if (!DOMINIOS_PERMITIDOS.some(d => correo.endsWith(d))) {
    // Sugerencia para errores comunes de tipeo
    if (correo.endsWith("@gmail.cl") || correo.endsWith("@gmial.com")) return "¿Quisiste decir @gmail.com?";
    if (correo.endsWith("@duocuc.cl")) return "¿Quisiste decir @duoc.cl?";
    return "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  }
  return "";
}

/* RUN chileno sin puntos ni guion, validado con módulo 11 (R.16) */
function calcularDv(cuerpo) {
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

function runValido(v) {
  const run = v.trim().toUpperCase();
  if (run === "") return "";
  if (/[.\-]/.test(run)) return "Escribe el RUN sin puntos ni guion. Ej: 123456785.";
  if (run.length < 7 || run.length > 9) return "El RUN debe tener entre 7 y 9 caracteres.";
  if (!/^\d+[0-9K]$/.test(run)) return "Solo números y el dígito verificador (0-9 o K) al final.";
  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);
  const esperado = calcularDv(cuerpo);
  if (dv !== esperado) return `El RUN no es válido: el dígito verificador debería ser ${esperado}.`;
  return "";
}

const numeroMinimo = (min, soloEnteros) => (v) => {
  const texto = v.trim();
  if (texto === "") return "";
  const numero = Number(texto.replace(",", "."));
  if (Number.isNaN(numero)) return "Ingresa un número.";
  if (soloEnteros && !Number.isInteger(numero)) return "Solo números enteros, sin decimales.";
  if (numero < min) return `El valor mínimo es ${min}.`;
  return "";
};

const largoEntre = (min, max, nombre) => (v) => {
  const n = v.length;
  if (n === 0) return "";
  return n < min || n > max ? `${nombre} debe tener entre ${min} y ${max} caracteres.` : "";
};

const igualA = (idOtro, mensaje) => (v) => v !== document.getElementById(idOtro).value ? mensaje : "";

const fechaPasada = (v) => v && new Date(v) > new Date() ? "La fecha no puede ser futura." : "";

/* ---------- Motor de validación ---------- */
function mostrarEstado(campo, error) {
  const feedback = document.getElementById(campo.id + "-error");
  campo.classList.toggle("is-invalid", error !== "");
  campo.classList.toggle("is-valid", error === "" && campo.value.trim() !== "");
  if (feedback) feedback.textContent = error;
}

function validarCampo(campo, reglas) {
  const valor = campo.type === "checkbox" ? (campo.checked ? "si" : "") : campo.value;
  const error = reglas.map(regla => regla(valor)).find(msg => msg !== "") || "";
  mostrarEstado(campo, error);
  return error === "";
}

// Contador de caracteres: <small data-contador="idCampo" data-max="500">
function activarContadores(form) {
  form.querySelectorAll("[data-contador]").forEach(etiqueta => {
    const campo = document.getElementById(etiqueta.dataset.contador);
    const max = Number(etiqueta.dataset.max);
    const pintar = () => {
      etiqueta.textContent = `${campo.value.length}/${max}`;
      etiqueta.classList.toggle("text-danger", campo.value.length > max);
    };
    campo.addEventListener("input", pintar);
    pintar();
  });
}

/**
 * Conecta un formulario con sus reglas.
 * reglas = { idCampo: [regla1, regla2, ...] }
 * alEnviar(datos) se ejecuta solo si todo es válido (R.19).
 */
function conectarFormulario(form, reglas, alEnviar) {
  Object.entries(reglas).forEach(([id, lista]) => {
    const campo = document.getElementById(id);
    if (!campo) return;
    const evento = campo.tagName === "SELECT" || campo.type === "checkbox" || campo.type === "date" ? "change" : "input";
    campo.addEventListener(evento, () => validarCampo(campo, lista));
    campo.addEventListener("blur", () => validarCampo(campo, lista));
  });
  activarContadores(form);

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let primero = null;
    Object.entries(reglas).forEach(([id, lista]) => {
      const campo = document.getElementById(id);
      if (campo && !validarCampo(campo, lista) && !primero) primero = campo;
    });
    if (primero) {
      primero.focus();
      return;
    }
    const datos = Object.fromEntries(new FormData(form).entries());
    Object.keys(datos).forEach(k => { if (typeof datos[k] === "string") datos[k] = datos[k].trim(); });
    alEnviar(datos);
  });
}

function limpiarFormulario(form) {
  form.reset();
  form.querySelectorAll(".is-valid, .is-invalid").forEach(c => c.classList.remove("is-valid", "is-invalid"));
  form.querySelectorAll("[data-contador]").forEach(e => { e.textContent = `0/${e.dataset.max}`; e.classList.remove("text-danger"); });
}

/* ---------- Reglas del usuario (compartidas por registro y admin) ---------- */
function reglasUsuario({ runOriginal = null, correoOriginal = null } = {}) {
  const usuarios = obtenerUsuarios();
  return {
    run: [requerido("Ingresa el RUN."), runValido,
      v => usuarios.some(u => u.run === v.trim().toUpperCase() && u.run !== runOriginal) ? "Ya existe un usuario con este RUN." : ""],
    nombre: [requerido("Ingresa el nombre."), maxLargo(50)],
    apellidos: [requerido("Ingresa los apellidos."), maxLargo(100)],
    correo: [requerido("Ingresa el correo."), maxLargo(100), correoPermitido,
      v => usuarios.some(u => u.correo === v.trim().toLowerCase() && u.correo !== correoOriginal) ? "Este correo ya está registrado." : ""],
    fechaNacimiento: [fechaPasada],
    region: [requerido("Selecciona una región.")],
    comuna: [requerido("Selecciona una comuna.")],
    direccion: [requerido("Ingresa la dirección."), maxLargo(300)]
  };
}
