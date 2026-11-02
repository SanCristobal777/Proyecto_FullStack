import { Link } from "react-router-dom";
import type { Producto } from "../data/datos";
import { formatearPrecio, rutaImagen } from "../utils/almacen";
import { useCarrito } from "../context/carrito";

interface Props {
  producto: Producto;
  conBoton?: boolean;
}

export default function TarjetaProducto({ producto: p, conBoton = true }: Props) {
  const { agregar } = useCarrito();
  const agotado = p.stock <= 0;
  const enlace = `/producto/${encodeURIComponent(p.codigo)}`;

  return (
    <div className="col">
      <article className="card tarjeta-producto h-100">
        {agotado ? (
          <span className="badge text-bg-secondary etiqueta-producto">Agotado</span>
        ) : p.precio === 0 ? (
          <span className="badge etiqueta-producto etiqueta-free">FREE</span>
        ) : null}

        <Link to={enlace} className="ratio ratio-4x3 d-block">
          <img src={rutaImagen(p.imagen)} className="card-img-top" alt={p.nombre} loading="lazy" />
        </Link>

        <div className="card-body d-flex flex-column">
          <p className="small text-body-secondary mb-1">{p.categoria}</p>
          <h3 className="h6 card-title">
            <Link to={enlace} className="stretched-link-titulo">{p.nombre}</Link>
          </h3>
          <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
            <span className="precio">{formatearPrecio(p.precio)}</span>
            {conBoton && (
              <button
                type="button"
                className="btn btn-pz btn-sm"
                disabled={agotado}
                onClick={() => agregar(p.codigo, 1)}
              >
                <i className="bi bi-cart-plus" aria-hidden="true"></i> {agotado ? "Agotado" : "Añadir"}
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}