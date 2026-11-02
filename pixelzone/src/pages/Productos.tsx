import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TarjetaProducto from "../components/TarjetaProducto";
import { CATEGORIAS } from "../data/datos";
import { obtenerProductos } from "../utils/almacen";

function ListaProductos({ inicial }: { inicial: string[] }) {
  const [elegidas, setElegidas] = useState<string[]>(inicial);
  const productos = useMemo(() => obtenerProductos(), []);

  const lista = productos.filter((p) => elegidas.length === 0 || elegidas.includes(p.categoria));

  const alternar = (categoria: string) =>
    setElegidas((prev) =>
      prev.includes(categoria) ? prev.filter((c) => c !== categoria) : [...prev, categoria]
    );

  return (
    <main className="container">
      <div className="titulo-pagina">
        <h1 className="mb-1">Productos</h1>
        <p className="text-body-secondary mb-0" aria-live="polite">
          {lista.length} producto{lista.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="row g-4">
        <aside className="col-lg-3">
          <div className="barra-lateral">
            <h2 className="h6">Categorías</h2>
            <ul className="list-group mb-2">
              {CATEGORIAS.map((c, i) => (
                <li key={c} className="list-group-item">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    id={`cat-${i}`}
                    checked={elegidas.includes(c)}
                    onChange={() => alternar(c)}
                  />
                  <label className="form-check-label stretched-link" htmlFor={`cat-${i}`}>
                    {c}
                  </label>
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setElegidas([])}>
              Limpiar filtros
            </button>
          </div>
        </aside>

        <section className="col-lg-9" aria-label="Listado de productos">
          {lista.length > 0 ? (
            <div className="row row-cols-2 row-cols-md-3 g-3">
              {lista.map((p) => (
                <TarjetaProducto key={p.codigo} producto={p} />
              ))}
            </div>
          ) : (
            <p className="text-body-secondary">No hay productos en estas categorías.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default function Productos() {
  const [params] = useSearchParams();
  const categoria = params.get("categoria");
  return <ListaProductos key={categoria ?? ""} inicial={categoria ? [categoria] : []} />;
}