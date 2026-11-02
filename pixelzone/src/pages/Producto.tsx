import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import TarjetaProducto from "../components/TarjetaProducto";
import { useCarrito } from "../context/carrito";
import { buscarProducto, formatearPrecio, obtenerProductos, rutaImagen } from "../utils/almacen";

function DetalleProducto({ codigo }: { codigo: string }) {
  const { agregar } = useCarrito();
  const p = useMemo(() => buscarProducto(codigo), [codigo]);
  const [vistaActiva, setVistaActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    document.title = p ? `${p.nombre} | PixelZone` : "Producto no encontrado | PixelZone";
  }, [p]);

  const relacionados = useMemo(
    () =>
      p
        ? obtenerProductos()
            .filter((x) => x.categoria === p.categoria && x.codigo !== p.codigo)
            .slice(0, 5)
        : [],
    [p]
  );

  if (!p) {
    return (
      <main>
        <div className="container mt-4">
          <div className="alert alert-warning">
            Producto no encontrado.{" "}
            <Link to="/productos" className="alert-link">Volver al catálogo</Link>
          </div>
        </div>
      </main>
    );
  }

  // Imagen principal + dos vistas más del mismo producto (-b y -c)
  const vistas = p.imagen.startsWith("img/productos/")
    ? [p.imagen, p.imagen.replace(".svg", "-b.svg"), p.imagen.replace(".svg", "-c.svg")]
    : [p.imagen];

  const sinStock = p.stock <= 0;
  const maxCantidad = Math.max(Math.min(p.stock, 10), 1);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    agregar(p.codigo, cantidad);
  };

  return (
    <main>
      <div className="container">
        <nav aria-label="Ruta de navegación" className="mt-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">
              <Link to={`/productos?categoria=${encodeURIComponent(p.categoria)}`}>{p.categoria}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">{p.nombre}</li>
          </ol>
        </nav>

        <section className="row g-4">
          <div className="col-lg-7">
            <div className="galeria">
              <div className="ratio ratio-4x3 galeria-principal">
                <img src={rutaImagen(vistas[vistaActiva])} alt={p.nombre} />
              </div>
              <div className="d-flex gap-2 mt-2" role="group" aria-label="Otras vistas">
                {vistas.map((v, i) => (
                  <button
                    key={v}
                    type="button"
                    className={`miniatura ${i === vistaActiva ? "activa" : ""}`}
                    aria-label={`Vista ${i + 1}`}
                    onClick={() => setVistaActiva(i)}
                  >
                    <img src={rutaImagen(v)} alt="" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <p className="text-body-secondary mb-1">{p.categoria} · Código {p.codigo}</p>
            <h1 className="h2">{p.nombre}</h1>
            <p className="precio precio-grande">{formatearPrecio(p.precio)}</p>
            <hr />
            <p>{p.descripcion || "Sin descripción."}</p>
            <p className={`small ${p.stock > 0 ? "text-success" : "text-danger"}`}>
              {p.stock > 0 ? `${p.stock} unidades disponibles` : "Sin stock por ahora"}
            </p>
            <hr />
            <form className="row g-2 align-items-end" onSubmit={enviar}>
              <div className="col-4">
                <label htmlFor="cantidad" className="form-label">Cantidad</label>
                <select
                  id="cantidad"
                  className="form-select"
                  disabled={sinStock}
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                >
                  {Array.from({ length: maxCantidad }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="col-8 d-grid">
                <button type="submit" className="btn btn-pz btn-lg" disabled={sinStock}>
                  <i className="bi bi-cart-plus" aria-hidden="true"></i> Añadir al carrito
                </button>
              </div>
            </form>
          </div>
        </section>

        <hr className="my-5" />

        <section aria-labelledby="titulo-relacionados">
          <h2 id="titulo-relacionados" className="h4 mb-3">Productos relacionados</h2>
          {relacionados.length > 0 ? (
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
              {relacionados.map((x) => (
                <TarjetaProducto key={x.codigo} producto={x} conBoton={false} />
              ))}
            </div>
          ) : (
            <p className="text-body-secondary">No hay otros productos en esta categoría.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default function Producto() {
  const { codigo = "" } = useParams();
  return <DetalleProducto key={codigo} codigo={codigo} />;
}