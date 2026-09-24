/* =========================================================
   almacen.js - Manejo de datos en localStorage
   Productos, usuarios, órdenes, sesión y carrito.
   ========================================================= */

const CLAVES = {
  productos: "pz_productos",
  usuarios: "pz_usuarios",
  ordenes: "pz_ordenes",
  sesion: "pz_sesion",
  carrito: "pz_carrito",
  mensajes: "pz_mensajes"
};

// Prefijo de rutas: las páginas de /admin usan data-base="../" en el <body>
const BASE = document.body.dataset.base || "";

function leer(clave, porDefecto) {
  try {
    const valor = JSON.parse(localStorage.getItem(clave));
    return valor ?? porDefecto;
  } catch (e) {
    // Datos corruptos: se reinician sin romper la página (R.3.3.3 fiabilidad)
    localStorage.removeItem(clave);
    return porDefecto;
  }
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

/* ---------- Productos ---------- */
function obtenerProductos() {
  let lista = leer(CLAVES.productos, null);
  if (!Array.isArray(lista)) {
    lista = structuredClone(PRODUCTOS_INICIALES);
    guardar(CLAVES.productos, lista);
  }
  return lista;
}
function guardarProductos(lista) { guardar(CLAVES.productos, lista); }
function buscarProducto(codigo) { return obtenerProductos().find(p => p.codigo === codigo); }

/* ---------- Usuarios ---------- */
function obtenerUsuarios() {
  let lista = leer(CLAVES.usuarios, null);
  if (!Array.isArray(lista)) {
    lista = structuredClone(USUARIOS_INICIALES);
    guardar(CLAVES.usuarios, lista);
  }
  return lista;
}
function guardarUsuarios(lista) { guardar(CLAVES.usuarios, lista); }

/* ---------- Órdenes ---------- */
function obtenerOrdenes() {
  let lista = leer(CLAVES.ordenes, null);
  if (!Array.isArray(lista)) {
    lista = structuredClone(ORDENES_INICIALES);
    guardar(CLAVES.ordenes, lista);
  }
  return lista;
}
function guardarOrdenes(lista) { guardar(CLAVES.ordenes, lista); }

/* ---------- Sesión ---------- */
function obtenerSesion() { return leer(CLAVES.sesion, null); }
function iniciarSesion(usuario) {
  const { run, nombre, apellidos, correo, tipo } = usuario;
  guardar(CLAVES.sesion, { run, nombre, apellidos, correo, tipo });
}
function cerrarSesion() {
  localStorage.removeItem(CLAVES.sesion);
  window.location.href = BASE + "index.html";
}

/* ---------- Carrito: [{ codigo, cantidad }] ---------- */
function obtenerCarrito() {
  const carrito = leer(CLAVES.carrito, []);
  return Array.isArray(carrito) ? carrito : [];
}
function guardarCarrito(carrito) {
  guardar(CLAVES.carrito, carrito);
  actualizarContadorCarrito();
}
function cantidadEnCarrito() {
  return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
}

/**
 * Agrega un producto al carrito respetando el stock (R.4).
 * Devuelve { ok, mensaje } para mostrar al usuario.
 */
function agregarAlCarrito(codigo, cantidad = 1) {
  const producto = buscarProducto(codigo);
  if (!producto) return { ok: false, mensaje: "El producto ya no existe." };
  if (producto.stock <= 0) return { ok: false, mensaje: "Este producto está agotado." };

  const carrito = obtenerCarrito();
  const item = carrito.find(i => i.codigo === codigo);
  const actual = item ? item.cantidad : 0;

  if (actual + cantidad > producto.stock) {
    return { ok: false, mensaje: `Solo quedan ${producto.stock} unidades de ${producto.nombre} y ya tienes ${actual} en el carrito.` };
  }
  if (item) item.cantidad += cantidad;
  else carrito.push({ codigo, cantidad });

  guardarCarrito(carrito);
  return { ok: true, mensaje: `${producto.nombre} se agregó al carrito.` };
}

/* ---------- Utilidades de interfaz ---------- */
function formatearPrecio(valor) {
  if (Number(valor) === 0) return "GRATIS";
  return "$" + Number(valor).toLocaleString("es-CL", { maximumFractionDigits: 2 });
}

// Las imágenes cargadas desde el admin se guardan como data:URL
function rutaImagen(src) {
  if (!src) return BASE + "img/productos/sin-imagen.svg";
  return src.startsWith("data:") ? src : BASE + src;
}

function actualizarContadorCarrito() {
  document.querySelectorAll("[data-contador-carrito]").forEach(el => {
    el.textContent = cantidadEnCarrito();
  });
}

// Muestra el usuario conectado en la barra superior de la tienda
function pintarZonaUsuario() {
  const zona = document.getElementById("zona-usuario");
  if (!zona) return;
  const sesion = obtenerSesion();
  if (!sesion) return; // se mantienen los enlaces "Iniciar sesión | Registrarse"

  const panel = sesion.tipo !== "Cliente"
    ? `<a href="${BASE}admin/index.html" class="link-light">Panel de administración</a> <span class="text-white-50">|</span> `
    : "";
  zona.innerHTML = `<span class="me-2">Hola, ${sesion.nombre}</span> ${panel}
    <button type="button" class="btn btn-link link-light p-0 align-baseline" id="btn-salir">Cerrar sesión</button>`;
  document.getElementById("btn-salir").addEventListener("click", cerrarSesion);
}

// Aviso flotante reutilizable (usa el componente Toast de Bootstrap)
function avisar(mensaje, tipo = "success") {
  let contenedor = document.getElementById("avisos");
  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "avisos";
    contenedor.className = "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(contenedor);
  }
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${tipo} border-0`;
  toast.setAttribute("role", "status");
  toast.innerHTML = `<div class="d-flex"><div class="toast-body">${mensaje}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>`;
  contenedor.appendChild(toast);
  const instancia = new bootstrap.Toast(toast, { delay: 3000 });
  toast.addEventListener("hidden.bs.toast", () => toast.remove());
  instancia.show();
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  pintarZonaUsuario();
});
