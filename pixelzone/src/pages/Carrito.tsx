import { Link } from "react-router-dom";
import { useCarrito } from "../context/carrito";
import { buscarProducto, formatearPrecio, rutaImagen } from "../utils/almacen";

export default function Carrito() {
  const { items, cambiarCantidad, eliminar } = useCarrito();

  // Se ignoran los productos que ya no existen en el catálogo
  const lineas = items.flatMap((item) => {
    const producto = buscarProducto(item.codigo);
    return producto ? [{ producto, cantidad: item.cantidad }] : [];
  });

  return (
    <main>
      <div className="container">
        <h1 className="titulo-pagina">Mi carrito de compras</h1>
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
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                  <dt className="h5">Total</dt>
                  <dd className="h4 precio mb-0">$0</dd>
                </div>
              </dl>
              <div className="d-grid">
                <button type="button" className="btn btn-pz btn-lg" disabled>
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
