import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCarrito } from "../context/carrito";
import { CUPONES } from "../data/datos";
import {
  buscarProducto,
  formatearPrecio,
  guardarOrdenes,
  guardarProductos,
  obtenerOrdenes,
  obtenerProductos,
  obtenerSesion,
  rutaImagen,
} from "../utils/almacen";

// En el resumen, un monto de 0 se muestra como $0 y no como GRATIS
function formatearMonto(valor: number) {
  return formatearPrecio(valor).replace("GRATIS", "$0");
}

export default function Carrito() {
  const { items, cambiarCantidad, eliminar, vaciar } = useCarrito();
  const [cupon, setCupon] = useState("");
  const [cuponAplicado, setCuponAplicado] = useState<string | null>(null);
  const [errorCupon, setErrorCupon] = useState("");
  const [ordenCreada, setOrdenCreada] = useState<string | null>(null);
  const [errorPago, setErrorPago] = useState("");

  // Se ignoran los productos que ya no existen en el catálogo
  const lineas = items.flatMap((item) => {
    const producto = buscarProducto(item.codigo);
    return producto ? [{ producto, cantidad: item.cantidad }] : [];
  });

  const subtotal = lineas.reduce(
    (suma, l) => suma + l.producto.precio * l.cantidad,
    0,
  );
  const descuento = cuponAplicado
    ? Math.round(subtotal * CUPONES[cuponAplicado])
    : 0;
  const total = subtotal - descuento;

  const aplicarCupon = (e: FormEvent) => {
    e.preventDefault();
    const codigo = cupon.trim().toUpperCase();
    if (codigo === "") {
      setErrorCupon("Escribe un cupón.");
      return;
    }
    if (CUPONES[codigo] === undefined) {
      setErrorCupon(`El cupón ${codigo} no existe o ya venció.`);
      return;
    }
    setErrorCupon("");
    setCuponAplicado(codigo);
  };

  // Pagar: crea la orden, descuenta stock y vacía el carrito
  const pagar = () => {
    if (lineas.length === 0) return;

    const sinStock = lineas.find((l) => l.cantidad > l.producto.stock);
    if (sinStock) {
      setOrdenCreada(null);
      setErrorPago(`No hay stock suficiente de ${sinStock.producto.nombre}.`);
      return;
    }

    // Se descuenta el stock de cada producto comprado
    const productos = obtenerProductos().map((p) => {
      const linea = lineas.find((l) => l.producto.codigo === p.codigo);
      return linea ? { ...p, stock: p.stock - linea.cantidad } : p;
    });

    const ordenes = obtenerOrdenes();
    const numero = "OC-" + (1001 + ordenes.length);
    const sesion = obtenerSesion();

    guardarProductos(productos);
    guardarOrdenes([
      ...ordenes,
      {
        numero,
        fecha: new Date().toISOString().slice(0, 10),
        cliente: sesion?.correo ?? "Invitado",
        estado: "Pagada",
        items: lineas.map((l) => ({
          codigo: l.producto.codigo,
          nombre: l.producto.nombre,
          precio: l.producto.precio,
          cantidad: l.cantidad,
        })),
        total,
      },
    ]);

    vaciar();
    setCupon("");
    setCuponAplicado(null);
    setErrorCupon("");
    setErrorPago("");
    setOrdenCreada(numero);
  };

  return (
    <main>
      <div className="container">
        <h1 className="titulo-pagina">Mi carrito de compras</h1>

        {ordenCreada && (
          <div className="alert alert-success" role="status">
            Compra realizada. Tu número de orden es{" "}
            <strong>{ordenCreada}</strong>.
          </div>
        )}
        {errorPago && (
          <div className="alert alert-danger" role="alert">
            {errorPago}
          </div>
        )}

        <div className="row g-4">
          <section className="col-lg-8" aria-label="Productos en el carrito">
            {lineas.length === 0 ? (
              <div className="text-center py-5">
                <p className="h5">Tu carrito está vacío</p>
                <p className="text-body-secondary">
                  Agrega productos desde el catálogo para verlos aquí.
                </p>
                <Link to="/productos" className="btn btn-pz">
                  Ver productos
                </Link>
              </div>
            ) : (
              lineas.map(({ producto, cantidad }) => (
                <article
                  key={producto.codigo}
                  className="item-carrito d-flex gap-3 align-items-center py-3 border-bottom"
                >
                  <img
                    src={rutaImagen(producto.imagen)}
                    alt={producto.nombre}
                    className="miniatura-carrito"
                  />
                  <div className="flex-grow-1">
                    <h2 className="h6 mb-1">
                      <Link to={`/producto/${producto.codigo}`}>
                        {producto.nombre}
                      </Link>
                    </h2>
                    <p className="small text-body-secondary mb-2">
                      {formatearPrecio(producto.precio)} c/u
                    </p>
                    <div className="input-group input-group-sm selector-cantidad">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        aria-label="Quitar una unidad"
                        disabled={cantidad <= 1}
                        onClick={() => cambiarCantidad(producto.codigo, -1)}
                      >
                        −
                      </button>
                      <span
                        className="input-group-text bg-body"
                        aria-live="polite"
                      >
                        {cantidad}
                      </span>
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        aria-label="Agregar una unidad"
                        disabled={cantidad >= producto.stock}
                        onClick={() => cambiarCantidad(producto.codigo, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="fw-semibold mb-2">
                      {formatearPrecio(producto.precio * cantidad)}
                    </p>
                    <button
                      type="button"
                      className="btn btn-sm btn-link link-danger p-0"
                      onClick={() => eliminar(producto.codigo)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>

          <aside className="col-lg-4">
            <div className="resumen-compra bg-white p-4">
              <h2 className="h5">Resumen</h2>
              <dl className="mb-3">
                <div className="d-flex justify-content-between">
                  <dt className="fw-normal">Subtotal</dt>
                  <dd className="mb-1">{formatearMonto(subtotal)}</dd>
                </div>
                {descuento > 0 && (
                  <div className="d-flex justify-content-between text-success">
                    <dt className="fw-normal">Descuento</dt>
                    <dd className="mb-1">−{formatearMonto(descuento)}</dd>
                  </div>
                )}
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                  <dt className="h5">Total</dt>
                  <dd className="h4 precio mb-0">{formatearMonto(total)}</dd>
                </div>
              </dl>

              <form onSubmit={aplicarCupon} noValidate className="mb-3">
                <label htmlFor="cupon" className="form-label small">
                  Cupón de descuento
                </label>
                <div className="input-group has-validation">
                  <input
                    type="text"
                    className={`form-control text-uppercase ${
                      errorCupon
                        ? "is-invalid"
                        : cuponAplicado
                          ? "is-valid"
                          : ""
                    }`}
                    id="cupon"
                    placeholder="Ej: GAMER10"
                    value={cupon}
                    onChange={(e) => setCupon(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary" type="submit">
                    Aplicar
                  </button>
                  <div className="invalid-feedback">{errorCupon}</div>
                  {cuponAplicado && (
                    <div className="valid-feedback">
                      Cupón {cuponAplicado} aplicado:{" "}
                      {Math.round(CUPONES[cuponAplicado] * 100)}% de descuento.
                    </div>
                  )}
                </div>
              </form>

              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-pz btn-lg"
                  disabled={lineas.length === 0}
                  onClick={pagar}
                >
                  Pagar
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
