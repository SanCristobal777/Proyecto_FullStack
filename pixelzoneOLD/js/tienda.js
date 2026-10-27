/* =========================================================
   tienda.js - Home, Productos, Detalle y Carrito
   Cada página indica cuál es con <body data-pagina="...">
   ========================================================= */

/* ---------- Tarjeta de producto reutilizable (R.2) ---------- */
function tarjetaProducto(p, conBoton = true) {
  const agotado = p.stock <= 0;
  const etiqueta = agotado
    ? '<span class="badge text-bg-secondary etiqueta-producto">Agotado</span>'
    : p.precio === 0 ? '<span class="badge etiqueta-producto etiqueta-free">FREE</span>' : "";
  const boton = conBoton
    ? `<button type="button" class="btn btn-pz btn-sm" data-agregar="${p.codigo}" ${agotado ? "disabled" : ""}>
         <i class="bi bi-cart-plus" aria-hidden="true"></i> ${agotado ? "Agotado" : "Añadir"}
       </button>`
    : "";
  return `
    <div class="col">
      <article class="card tarjeta-producto h-100">
        ${etiqueta}
        <a href="producto.html?codigo=${encodeURIComponent(p.codigo)}" class="ratio ratio-4x3 d-block">
          <img src="${rutaImagen(p.imagen)}" class="card-img-top" alt="${p.nombre}" loading="lazy">
        </a>
        <div class="card-body d-flex flex-column">
          <p class="small text-body-secondary mb-1">${p.categoria}</p>
          <h3 class="h6 card-title">
            <a href="producto.html?codigo=${encodeURIComponent(p.codigo)}" class="stretched-link-titulo">${p.nombre}</a>
          </h3>
          <div class="mt-auto d-flex justify-content-between align-items-center gap-2">
            <span class="precio">${formatearPrecio(p.precio)}</span>
            ${boton}
          </div>
        </div>
      </article>
    </div>`;
}

// Delegación: cualquier botón con data-agregar suma 1 unidad al carrito (R.4)
document.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-agregar]");
  if (!boton) return;
  const resultado = agregarAlCarrito(boton.dataset.agregar, 1);
  avisar(resultado.mensaje, resultado.ok ? "success" : "warning");
});

/* ---------- Home: productos destacados (R.1) ---------- */
function iniciarHome() {
  const grilla = document.getElementById("grilla-destacados");
  // Hasta 2 productos con stock por categoría, para mostrar variedad
  const disponibles = obtenerProductos().filter(p => p.stock > 0);
  const destacados = CATEGORIAS.flatMap(c => disponibles.filter(p => p.categoria === c).slice(0, 2)).slice(0, 8);
  grilla.innerHTML = destacados.map(p => tarjetaProducto(p, false)).join("");
}

/* ---------- Productos: listado + filtro por categoría (R.2) ---------- */
function iniciarProductos() {
  const grilla = document.getElementById("grilla-productos");
  const filtros = document.getElementById("filtros");
  const resumen = document.getElementById("resumen-filtro");

  filtros.innerHTML = CATEGORIAS.map((c, i) => `
    <li class="list-group-item">
      <input class="form-check-input me-2" type="checkbox" value="${c}" id="cat-${i}">
      <label class="form-check-label stretched-link" for="cat-${i}">${c}</label>
    </li>`).join("");

  // Si llega ?categoria=Consolas desde el footer, se marca de inmediato
  const desdeUrl = new URLSearchParams(location.search).get("categoria");
  if (desdeUrl) filtros.querySelectorAll("input").forEach(ch => { ch.checked = ch.value === desdeUrl; });

  function pintar() {
    const elegidas = [...filtros.querySelectorAll("input:checked")].map(ch => ch.value);
    const lista = obtenerProductos().filter(p => elegidas.length === 0 || elegidas.includes(p.categoria));
    grilla.innerHTML = lista.length
      ? lista.map(p => tarjetaProducto(p)).join("")
      : '<p class="text-body-secondary">No hay productos en estas categorías.</p>';
    resumen.textContent = `${lista.length} producto${lista.length === 1 ? "" : "s"}`;
  }

  filtros.addEventListener("change", pintar);
  document.getElementById("limpiar-filtros").addEventListener("click", () => {
    filtros.querySelectorAll("input").forEach(ch => { ch.checked = false; });
    pintar();
  });
  pintar();
}

/* ---------- Detalle de producto (R.3) ---------- */
function iniciarDetalle() {
  const codigo = new URLSearchParams(location.search).get("codigo");
  const p = buscarProducto(codigo);
  const contenedor = document.getElementById("detalle");

  if (!p) {
    contenedor.innerHTML = `<div class="alert alert-warning">Producto no encontrado.
      <a href="productos.html" class="alert-link">Volver al catálogo</a></div>`;
    return;
  }

  document.title = `${p.nombre} | PixelZone`;
  document.getElementById("migas-categoria").innerHTML =
    `<a href="productos.html?categoria=${encodeURIComponent(p.categoria)}">${p.categoria}</a>`;
  document.getElementById("migas-producto").textContent = p.nombre;

  // Miniaturas: la imagen principal y dos vistas del mismo producto
  const vistas = p.imagen && !p.imagen.startsWith("data:") && p.imagen.startsWith("img/productos/")
    ? [p.imagen, p.imagen.replace(".svg", "-b.svg"), p.imagen.replace(".svg", "-c.svg")]
    : [p.imagen];
  const maxCantidad = Math.min(p.stock, 10);

  contenedor.innerHTML = `
    <div class="col-lg-7">
      <div class="galeria">
        <div class="ratio ratio-4x3 galeria-principal">
          <img id="imagen-principal" src="${rutaImagen(vistas[0])}" alt="${p.nombre}">
        </div>
        <div class="d-flex gap-2 mt-2" role="group" aria-label="Otras vistas">
          ${vistas.map((v, i) => `
            <button type="button" class="miniatura ${i === 0 ? "activa" : ""}" data-vista="${rutaImagen(v)}" aria-label="Vista ${i + 1}">
              <img src="${rutaImagen(v)}" alt="">
            </button>`).join("")}
        </div>
      </div>
    </div>
    <div class="col-lg-5">
      <p class="text-body-secondary mb-1">${p.categoria} · Código ${p.codigo}</p>
      <h1 class="h2">${p.nombre}</h1>
      <p class="precio precio-grande">${formatearPrecio(p.precio)}</p>
      <hr>
      <p>${p.descripcion || "Sin descripción."}</p>
      <p class="small ${p.stock > 0 ? "text-success" : "text-danger"}">
        ${p.stock > 0 ? `${p.stock} unidades disponibles` : "Sin stock por ahora"}
      </p>
      <hr>
      <form id="form-agregar" class="row g-2 align-items-end">
        <div class="col-4">
          <label for="cantidad" class="form-label">Cantidad</label>
          <select id="cantidad" class="form-select" ${p.stock <= 0 ? "disabled" : ""}>
            ${Array.from({ length: Math.max(maxCantidad, 1) }, (_, i) => `<option>${i + 1}</option>`).join("")}
          </select>
        </div>
        <div class="col-8 d-grid">
          <button type="submit" class="btn btn-pz btn-lg" ${p.stock <= 0 ? "disabled" : ""}>
            <i class="bi bi-cart-plus" aria-hidden="true"></i> Añadir al carrito
          </button>
        </div>
      </form>
    </div>`;

  contenedor.addEventListener("click", (e) => {
    const mini = e.target.closest("[data-vista]");
    if (!mini) return;
    document.getElementById("imagen-principal").src = mini.dataset.vista;
    contenedor.querySelectorAll(".miniatura").forEach(m => m.classList.toggle("activa", m === mini));
  });

  document.getElementById("form-agregar").addEventListener("submit", (e) => {
    e.preventDefault();
    const cantidad = Number(document.getElementById("cantidad").value);
    const resultado = agregarAlCarrito(p.codigo, cantidad);
    avisar(resultado.mensaje, resultado.ok ? "success" : "warning");
  });

  // Productos relacionados: misma categoría, máximo 5
  const relacionados = obtenerProductos().filter(x => x.categoria === p.categoria && x.codigo !== p.codigo).slice(0, 5);
  document.getElementById("grilla-relacionados").innerHTML = relacionados.length
    ? relacionados.map(x => tarjetaProducto(x, false)).join("")
    : '<p class="text-body-secondary">No hay otros productos en esta categoría.</p>';
}

/* ---------- Carrito de compras (R.5) ---------- */
function iniciarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const formCupon = document.getElementById("form-cupon");
  const inputCupon = document.getElementById("cupon");
  const errorCupon = document.getElementById("cupon-error");
  let cuponAplicado = null;

  function pintar() {
    // Se descartan del carrito los productos que el admin eliminó
    const carrito = obtenerCarrito().filter(i => buscarProducto(i.codigo));
    guardarCarrito(carrito);

    if (carrito.length === 0) {
      lista.innerHTML = `<div class="text-center py-5">
        <p class="h5">Tu carrito está vacío</p>
        <p class="text-body-secondary">Agrega productos desde el catálogo para verlos aquí.</p>
        <a href="productos.html" class="btn btn-pz">Ver productos</a></div>`;
    } else {
      lista.innerHTML = carrito.map(item => {
        const p = buscarProducto(item.codigo);
        return `
        <article class="item-carrito d-flex gap-3 align-items-center py-3 border-bottom">
          <img src="${rutaImagen(p.imagen)}" alt="${p.nombre}" class="miniatura-carrito">
          <div class="flex-grow-1">
            <h2 class="h6 mb-1"><a href="producto.html?codigo=${p.codigo}">${p.nombre}</a></h2>
            <p class="small text-body-secondary mb-2">${formatearPrecio(p.precio)} c/u</p>
            <div class="input-group input-group-sm selector-cantidad">
              <button class="btn btn-outline-secondary" type="button" data-accion="restar" data-codigo="${p.codigo}" aria-label="Quitar una unidad" ${item.cantidad <= 1 ? "disabled" : ""}>−</button>
              <span class="input-group-text bg-body" aria-live="polite">${item.cantidad}</span>
              <button class="btn btn-outline-secondary" type="button" data-accion="sumar" data-codigo="${p.codigo}" aria-label="Agregar una unidad" ${item.cantidad >= p.stock ? "disabled" : ""}>+</button>
            </div>
          </div>
          <div class="text-end">
            <p class="fw-semibold mb-2">${formatearPrecio(p.precio * item.cantidad)}</p>
            <button type="button" class="btn btn-sm btn-link link-danger p-0" data-accion="eliminar" data-codigo="${p.codigo}">Eliminar</button>
          </div>
        </article>`;
      }).join("");
    }

    const subtotal = carrito.reduce((s, i) => s + buscarProducto(i.codigo).precio * i.cantidad, 0);
    const descuento = cuponAplicado ? Math.round(subtotal * CUPONES[cuponAplicado]) : 0;
    document.getElementById("subtotal").textContent = formatearPrecio(subtotal).replace("GRATIS", "$0");
    document.getElementById("fila-descuento").hidden = descuento === 0;
    document.getElementById("descuento").textContent = "−" + formatearPrecio(descuento);
    document.getElementById("total").textContent = formatearPrecio(subtotal - descuento).replace("GRATIS", "$0");
    document.getElementById("btn-pagar").disabled = carrito.length === 0;
  }

  lista.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-accion]");
    if (!boton) return;
    const carrito = obtenerCarrito();
    const item = carrito.find(i => i.codigo === boton.dataset.codigo);
    const p = buscarProducto(item.codigo);
    if (boton.dataset.accion === "sumar" && item.cantidad < p.stock) item.cantidad++;
    if (boton.dataset.accion === "restar" && item.cantidad > 1) item.cantidad--;
    const nuevo = boton.dataset.accion === "eliminar" ? carrito.filter(i => i !== item) : carrito;
    guardarCarrito(nuevo);
    pintar();
  });

  formCupon.addEventListener("submit", (e) => {
    e.preventDefault();
    const codigo = inputCupon.value.trim().toUpperCase();
    if (codigo === "") {
      errorCupon.textContent = "Escribe un cupón.";
      inputCupon.classList.add("is-invalid");
      return;
    }
    if (!CUPONES[codigo]) {
      errorCupon.textContent = `El cupón ${codigo} no existe o ya venció.`;
      inputCupon.classList.add("is-invalid");
      return;
    }
    cuponAplicado = codigo;
    inputCupon.classList.remove("is-invalid");
    inputCupon.classList.add("is-valid");
    avisar(`Cupón ${codigo} aplicado: ${CUPONES[codigo] * 100}% de descuento.`);
    pintar();
  });

  // Pagar: crea la orden, descuenta stock y vacía el carrito
  document.getElementById("btn-pagar").addEventListener("click", () => {
    const carrito = obtenerCarrito();
    const productos = obtenerProductos();
    const items = carrito.map(i => {
      const p = productos.find(x => x.codigo === i.codigo);
      p.stock -= i.cantidad;
      return { codigo: p.codigo, nombre: p.nombre, precio: p.precio, cantidad: i.cantidad };
    });
    const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const total = subtotal - (cuponAplicado ? Math.round(subtotal * CUPONES[cuponAplicado]) : 0);
    const ordenes = obtenerOrdenes();
    const numero = "OC-" + (1001 + ordenes.length);
    const sesion = obtenerSesion();
    ordenes.push({ numero, fecha: new Date().toISOString().slice(0, 10), cliente: sesion ? sesion.correo : "Invitado",
      estado: "Pagada", items, total });

    guardarProductos(productos);
    guardarOrdenes(ordenes);
    guardarCarrito([]);
    cuponAplicado = null;
    inputCupon.value = "";
    inputCupon.classList.remove("is-valid");
    pintar();
    document.getElementById("mensaje-compra").innerHTML =
      `<div class="alert alert-success">Compra realizada. Tu número de orden es <strong>${numero}</strong>.</div>`;
  });

  pintar();
}

/* ---------- Arranque según la página ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const paginas = { home: iniciarHome, productos: iniciarProductos, detalle: iniciarDetalle, carrito: iniciarCarrito };
  const iniciar = paginas[document.body.dataset.pagina];
  if (iniciar) iniciar();
});
