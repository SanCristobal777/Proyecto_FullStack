/* =========================================================
   admin.js - Panel de administración
   Control de acceso por perfil, mantenedores de productos,
   usuarios y listado de órdenes.
   ========================================================= */

/* ---------- Control de acceso (R.11 y R.18) ---------- */
(function protegerPagina() {
  const sesion = obtenerSesion();
  const permitidos = (document.body.dataset.roles || "Administrador").split(",");
  if (!sesion) {
    window.location.replace("../login.html");
    return;
  }
  if (!permitidos.includes(sesion.tipo)) {
    // El Cliente solo accede a la tienda; el Vendedor vuelve al inicio del panel
    window.location.replace(sesion.tipo === "Cliente" ? "../index.html" : "index.html");
  }
})();

const SESION = obtenerSesion() || {};
const ES_ADMIN = SESION.tipo === "Administrador";

function prepararMenu() {
  document.querySelectorAll("[data-nombre-usuario]").forEach(el => { el.textContent = SESION.nombre || ""; });
  document.querySelectorAll("[data-perfil-usuario]").forEach(el => { el.textContent = SESION.tipo || ""; });
  // Las opciones solo para Administrador no aparecen para el Vendedor
  if (!ES_ADMIN) document.querySelectorAll("[data-solo-admin]").forEach(el => el.remove());
  document.querySelectorAll("[data-cerrar-sesion]").forEach(b => b.addEventListener("click", cerrarSesion));
}

const esCritico = (p) => p.stockCritico !== "" && p.stockCritico !== null && p.stock <= Number(p.stockCritico);

/* ---------- Home del panel ---------- */
function iniciarAdminHome() {
  const productos = obtenerProductos();
  const criticos = productos.filter(esCritico);
  const datos = [
    { etiqueta: "Productos", valor: productos.length, enlace: "productos.html", icono: "bi-controller" },
    { etiqueta: "Con stock crítico", valor: criticos.length, enlace: "productos.html", icono: "bi-exclamation-triangle" },
    { etiqueta: "Órdenes", valor: obtenerOrdenes().length, enlace: "ordenes.html", icono: "bi-receipt" }
  ];
  if (ES_ADMIN) datos.push({ etiqueta: "Usuarios", valor: obtenerUsuarios().length, enlace: "usuarios.html", icono: "bi-people" });

  document.getElementById("resumen").innerHTML = datos.map(d => `
    <div class="col-sm-6 col-xl-3">
      <a href="${d.enlace}" class="card resumen-card h-100 text-decoration-none">
        <div class="card-body">
          <i class="bi ${d.icono} fs-4" aria-hidden="true"></i>
          <p class="display-6 fw-semibold mb-0">${d.valor}</p>
          <p class="mb-0 text-body-secondary">${d.etiqueta}</p>
        </div>
      </a>
    </div>`).join("");

  document.getElementById("lista-criticos").innerHTML = criticos.length
    ? criticos.map(p => `<li class="list-group-item d-flex justify-content-between">
        <span>${p.nombre}</span><span class="badge text-bg-warning">Stock ${p.stock} / crítico ${p.stockCritico}</span></li>`).join("")
    : '<li class="list-group-item">Todo el inventario está sobre su stock crítico.</li>';
}

/* ---------- Listado de productos (R.12 y R.14) ---------- */
function iniciarAdminProductos() {
  const cuerpo = document.getElementById("tabla-productos");
  const modal = new bootstrap.Modal(document.getElementById("modal-detalle"));

  function pintar() {
    const productos = obtenerProductos();
    const criticos = productos.filter(esCritico);
    document.getElementById("alerta-stock").innerHTML = criticos.length
      ? `<div class="alert alert-warning d-flex gap-2" role="alert"><i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
          <div><strong>${criticos.length} producto(s) con stock crítico:</strong> ${criticos.map(p => p.nombre).join(", ")}.</div></div>`
      : "";

    cuerpo.innerHTML = productos.map(p => `
      <tr class="${esCritico(p) ? "table-warning" : ""}">
        <td><img src="${rutaImagen(p.imagen)}" alt="" class="miniatura-tabla"></td>
        <td><code>${p.codigo}</code></td>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td class="text-end">${formatearPrecio(p.precio)}</td>
        <td class="text-end">${p.stock}${esCritico(p) ? ' <i class="bi bi-exclamation-triangle-fill text-warning" title="Stock crítico"></i>' : ""}</td>
        <td class="text-end text-nowrap">
          <button type="button" class="btn btn-sm btn-outline-secondary" data-ver="${p.codigo}">Ver</button>
          ${ES_ADMIN ? `<a href="producto-form.html?codigo=${encodeURIComponent(p.codigo)}" class="btn btn-sm btn-outline-dark">Editar</a>
          <button type="button" class="btn btn-sm btn-outline-danger" data-eliminar="${p.codigo}">Eliminar</button>` : ""}
        </td>
      </tr>`).join("");
  }

  cuerpo.addEventListener("click", (e) => {
    const ver = e.target.closest("[data-ver]");
    const eliminar = e.target.closest("[data-eliminar]");
    if (ver) {
      const p = buscarProducto(ver.dataset.ver);
      document.getElementById("modal-titulo").textContent = p.nombre;
      document.getElementById("modal-cuerpo").innerHTML = `
        <div class="row g-3">
          <div class="col-md-5"><img src="${rutaImagen(p.imagen)}" alt="${p.nombre}" class="img-fluid rounded"></div>
          <div class="col-md-7">
            <dl class="row mb-0">
              <dt class="col-5">Código</dt><dd class="col-7">${p.codigo}</dd>
              <dt class="col-5">Categoría</dt><dd class="col-7">${p.categoria}</dd>
              <dt class="col-5">Precio</dt><dd class="col-7">${formatearPrecio(p.precio)}</dd>
              <dt class="col-5">Stock</dt><dd class="col-7">${p.stock}</dd>
              <dt class="col-5">Stock crítico</dt><dd class="col-7">${p.stockCritico === "" ? "No definido" : p.stockCritico}</dd>
            </dl>
            <p class="mt-2 mb-0">${p.descripcion || "Sin descripción."}</p>
          </div>
        </div>`;
      modal.show();
    }
    if (eliminar && confirm(`¿Eliminar el producto ${eliminar.dataset.eliminar}? Esta acción no se puede deshacer.`)) {
      guardarProductos(obtenerProductos().filter(p => p.codigo !== eliminar.dataset.eliminar));
      avisar("Producto eliminado.");
      pintar();
    }
  });

  pintar();
}

/* ---------- Nuevo / Editar producto (R.13) ---------- */
function iniciarProductoForm() {
  const form = document.getElementById("form-producto");
  const codigoEditar = new URLSearchParams(location.search).get("codigo");
  const existente = codigoEditar ? buscarProducto(codigoEditar) : null;
  const selCategoria = document.getElementById("categoria");
  const vistaPrevia = document.getElementById("vista-previa");
  let imagenElegida = existente ? existente.imagen : "";

  selCategoria.innerHTML = '<option value="">-- Seleccione la categoría --</option>' +
    CATEGORIAS.map(c => `<option>${c}</option>`).join("");

  if (existente) {
    document.getElementById("titulo-form").textContent = "Editar producto";
    document.getElementById("btn-guardar").textContent = "Guardar cambios";
    ["codigo", "nombre", "descripcion", "precio", "stock", "stockCritico", "categoria"].forEach(campo => {
      document.getElementById(campo).value = existente[campo] ?? "";
    });
    document.getElementById("codigo").readOnly = true;
    vistaPrevia.src = rutaImagen(existente.imagen);
    vistaPrevia.hidden = false;
  }

  // Imagen opcional: se guarda como data:URL (máximo 300 KB para no llenar localStorage)
  document.getElementById("imagen").addEventListener("change", (e) => {
    const archivo = e.target.files[0];
    const error = document.getElementById("imagen-error");
    e.target.classList.remove("is-invalid");
    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) {
      e.target.classList.add("is-invalid");
      error.textContent = "El archivo debe ser una imagen (JPG, PNG, WebP o SVG).";
      return;
    }
    if (archivo.size > 300 * 1024) {
      e.target.classList.add("is-invalid");
      error.textContent = "La imagen pesa más de 300 KB. Usa una versión optimizada.";
      return;
    }
    const lector = new FileReader();
    lector.onload = () => { imagenElegida = lector.result; vistaPrevia.src = lector.result; vistaPrevia.hidden = false; };
    lector.readAsDataURL(archivo);
  });

  const reglas = {
    codigo: [requerido("Ingresa el código."), minLargo(3),
      v => !existente && buscarProducto(v.trim().toUpperCase()) ? "Ya existe un producto con este código." : ""],
    nombre: [requerido("Ingresa el nombre."), maxLargo(100)],
    descripcion: [maxLargo(500)],
    precio: [requerido("Ingresa el precio."), numeroMinimo(0, false)],
    stock: [requerido("Ingresa el stock."), numeroMinimo(0, true)],
    stockCritico: [numeroMinimo(0, true)],
    categoria: [requerido("Selecciona una categoría.")]
  };

  conectarFormulario(form, reglas, (datos) => {
    const producto = {
      codigo: datos.codigo.toUpperCase(),
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: Number(datos.precio.replace(",", ".")),
      stock: Number(datos.stock),
      stockCritico: datos.stockCritico === "" ? "" : Number(datos.stockCritico),
      categoria: datos.categoria,
      imagen: imagenElegida || "img/productos/sin-imagen.svg"
    };
    const productos = obtenerProductos();
    const indice = productos.findIndex(p => p.codigo === producto.codigo);
    if (indice >= 0) productos[indice] = producto;
    else productos.push(producto);
    guardarProductos(productos);

    if (esCritico(producto)) {
      avisar(`Atención: ${producto.nombre} quedó con stock crítico (${producto.stock}).`, "warning");
    } else {
      avisar(existente ? "Cambios guardados." : "Producto creado.");
    }
    setTimeout(() => { window.location.href = "productos.html"; }, 1500);
  });
}

/* ---------- Listado de usuarios (R.15) ---------- */
function iniciarAdminUsuarios() {
  const cuerpo = document.getElementById("tabla-usuarios");
  const modal = new bootstrap.Modal(document.getElementById("modal-detalle"));
  const colores = { Administrador: "text-bg-primary", Vendedor: "text-bg-info", Cliente: "text-bg-secondary" };

  function pintar() {
    cuerpo.innerHTML = obtenerUsuarios().map(u => `
      <tr>
        <td><code>${u.run}</code></td>
        <td>${u.nombre} ${u.apellidos}</td>
        <td>${u.correo}</td>
        <td><span class="badge ${colores[u.tipo]}">${u.tipo}</span></td>
        <td>${u.comuna}, ${u.region}</td>
        <td class="text-end text-nowrap">
          <button type="button" class="btn btn-sm btn-outline-secondary" data-ver="${u.run}">Ver</button>
          <a href="usuario-form.html?run=${u.run}" class="btn btn-sm btn-outline-dark">Editar</a>
          <button type="button" class="btn btn-sm btn-outline-danger" data-eliminar="${u.run}" ${u.run === SESION.run ? "disabled title=\"No puedes eliminar tu propia cuenta\"" : ""}>Eliminar</button>
        </td>
      </tr>`).join("");
  }

  cuerpo.addEventListener("click", (e) => {
    const ver = e.target.closest("[data-ver]");
    const eliminar = e.target.closest("[data-eliminar]");
    if (ver) {
      const u = obtenerUsuarios().find(x => x.run === ver.dataset.ver);
      document.getElementById("modal-titulo").textContent = `${u.nombre} ${u.apellidos}`;
      document.getElementById("modal-cuerpo").innerHTML = `
        <dl class="row mb-0">
          <dt class="col-5">RUN</dt><dd class="col-7">${u.run}</dd>
          <dt class="col-5">Correo</dt><dd class="col-7">${u.correo}</dd>
          <dt class="col-5">Tipo de usuario</dt><dd class="col-7">${u.tipo}</dd>
          <dt class="col-5">Fecha de nacimiento</dt><dd class="col-7">${u.fechaNacimiento || "No informada"}</dd>
          <dt class="col-5">Dirección</dt><dd class="col-7">${u.direccion}, ${u.comuna}, ${u.region}</dd>
        </dl>`;
      modal.show();
    }
    if (eliminar && confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) {
      guardarUsuarios(obtenerUsuarios().filter(u => u.run !== eliminar.dataset.eliminar));
      avisar("Usuario eliminado.");
      pintar();
    }
  });

  pintar();
}

/* ---------- Nuevo / Editar usuario (R.16 y R.17) ---------- */
function iniciarUsuarioForm() {
  const form = document.getElementById("form-usuario");
  const runEditar = new URLSearchParams(location.search).get("run");
  const existente = runEditar ? obtenerUsuarios().find(u => u.run === runEditar) : null;

  enlazarRegionComuna(document.getElementById("region"), document.getElementById("comuna"),
    existente ? existente.region : "", existente ? existente.comuna : "");

  if (existente) {
    document.getElementById("titulo-form").textContent = "Editar usuario";
    document.getElementById("btn-guardar").textContent = "Guardar cambios";
    ["run", "nombre", "apellidos", "correo", "fechaNacimiento", "tipo", "direccion"].forEach(campo => {
      document.getElementById(campo).value = existente[campo] || "";
    });
    document.getElementById("run").readOnly = true;
    document.getElementById("password-ayuda").textContent = "Déjala en blanco para mantener la contraseña actual.";
  }

  const reglas = {
    ...reglasUsuario({ runOriginal: existente?.run, correoOriginal: existente?.correo }),
    tipo: [requerido("Selecciona el tipo de usuario.")],
    password: existente
      ? [largoEntre(4, 10, "La contraseña")]
      : [requerido("Ingresa la contraseña."), largoEntre(4, 10, "La contraseña")]
  };

  conectarFormulario(form, reglas, (datos) => {
    const usuario = {
      run: datos.run.toUpperCase(),
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      correo: datos.correo.toLowerCase(),
      fechaNacimiento: datos.fechaNacimiento || "",
      tipo: datos.tipo,
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion,
      password: datos.password || existente?.password
    };
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(u => u.run === usuario.run);
    if (indice >= 0) usuarios[indice] = usuario;
    else usuarios.push(usuario);
    guardarUsuarios(usuarios);
    avisar(existente ? "Cambios guardados." : "Usuario creado.");
    setTimeout(() => { window.location.href = "usuarios.html"; }, 1200);
  });
}

/* ---------- Órdenes (visible para Administrador y Vendedor) ---------- */
function iniciarAdminOrdenes() {
  const cuerpo = document.getElementById("tabla-ordenes");
  const modal = new bootstrap.Modal(document.getElementById("modal-detalle"));
  const ordenes = obtenerOrdenes().slice().reverse();

  cuerpo.innerHTML = ordenes.map(o => `
    <tr>
      <td><code>${o.numero}</code></td>
      <td>${o.fecha}</td>
      <td>${o.cliente}</td>
      <td>${o.estado}</td>
      <td class="text-end">${formatearPrecio(o.total).replace("GRATIS", "$0")}</td>
      <td class="text-end"><button type="button" class="btn btn-sm btn-outline-secondary" data-ver="${o.numero}">Ver detalle</button></td>
    </tr>`).join("");

  cuerpo.addEventListener("click", (e) => {
    const ver = e.target.closest("[data-ver]");
    if (!ver) return;
    const o = ordenes.find(x => x.numero === ver.dataset.ver);
    document.getElementById("modal-titulo").textContent = `Orden ${o.numero}`;
    document.getElementById("modal-cuerpo").innerHTML = `
      <p class="mb-2">${o.fecha} · ${o.cliente} · ${o.estado}</p>
      <table class="table table-sm">
        <thead><tr><th>Producto</th><th class="text-end">Cant.</th><th class="text-end">Subtotal</th></tr></thead>
        <tbody>${o.items.map(i => `<tr><td>${i.nombre}</td><td class="text-end">${i.cantidad}</td>
          <td class="text-end">${formatearPrecio(i.precio * i.cantidad).replace("GRATIS", "$0")}</td></tr>`).join("")}</tbody>
        <tfoot><tr><th colspan="2">Total pagado</th><th class="text-end">${formatearPrecio(o.total).replace("GRATIS", "$0")}</th></tr></tfoot>
      </table>`;
    modal.show();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  prepararMenu();
  const paginas = {
    "admin-home": iniciarAdminHome,
    "admin-productos": iniciarAdminProductos,
    "admin-producto-form": iniciarProductoForm,
    "admin-usuarios": iniciarAdminUsuarios,
    "admin-usuario-form": iniciarUsuarioForm,
    "admin-ordenes": iniciarAdminOrdenes
  };
  const iniciar = paginas[document.body.dataset.pagina];
  if (iniciar) iniciar();
});
