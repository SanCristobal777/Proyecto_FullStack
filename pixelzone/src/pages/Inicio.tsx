import { useMemo } from "react";
import TarjetaProducto from "../components/TarjetaProducto";
import { CATEGORIAS } from "../data/datos";
import { estaActiva } from "../data/directorio";
import { obtenerProductos } from "../utils/almacen";
import { Link } from "react-router-dom";

const datos = [
  { valor: "5", texto: "categorías" },
  { valor: "16", texto: "regiones con despacho" },
  { valor: "10%", texto: "de descuento con GAMER10" },
];

export default function Inicio() {
  const destacados = useMemo(() => {
    const disponibles = obtenerProductos().filter((p) => p.stock > 0);
    return CATEGORIAS.flatMap((c) =>
      disponibles.filter((p) => p.categoria === c).slice(0, 2),
    ).slice(0, 8);
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1 className="mb-3">
                Consolas, juegos y periféricos para jugar mejor
              </h1>
              <p className="lead mb-4">
                PixelZone es una tienda gamer online. Encuentra lo último en
                consolas, videojuegos y accesorios, con stock real y despacho a
                todo Chile.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/productos" className="btn btn-coral btn-lg">
                  <i className="bi bi-grid-3x3-gap" aria-hidden="true"></i> Ver
                  productos
                </Link>
                {estaActiva("blogs") && (
                  <Link to="/blogs" className="btn btn-outline-light btn-lg">
                    Leer el blog
                  </Link>
                )}
              </div>

              <dl className="hero-datos row mt-5 pt-3 mb-0">
                {datos.map((d) => (
                  <div
                    key={d.texto}
                    className="col-4 d-flex flex-column-reverse"
                  >
                    <dt>{d.texto}</dt>
                    <dd>{d.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="col-lg-6">
              <img
                src="/img/hero.svg"
                className="hero-imagen"
                alt="Control de videojuegos en estilo pixel-art"
                width={640}
                height={480}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container" aria-labelledby="titulo-destacados">
        <div className="d-flex justify-content-between align-items-end titulo-pagina">
          <h2 id="titulo-destacados" className="mb-0">
            Productos destacados
          </h2>
          <Link to="/productos">Ver todo el catálogo</Link>
        </div>
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
          {destacados.map((p) => (
            <TarjetaProducto key={p.codigo} producto={p} conBoton={false} />
          ))}
        </div>
      </section>
    </main>
  );
}
