import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <main className="container">
      <div className="titulo-pagina">
        <h1 className="mb-1">Página no disponible</h1>
        <p className="text-body-secondary">
          Esta página no existe o está desactivada.
        </p>
        <Link to="/" className="btn btn-coral">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
