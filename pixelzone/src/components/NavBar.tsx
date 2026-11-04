import { Fragment, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/carrito";
import { useSesion } from "../context/sesion";
import { estaActiva, paginasEn } from "../data/directorio";

export default function NavBar() {
  const [abierto, setAbierto] = useState(false);
  const { cantidadTotal } = useCarrito();
  const { sesion, cerrar: cerrarSesion } = useSesion();
  const navegar = useNavigate();

  const cerrar = () => setAbierto(false);
  const carritoActivo = estaActiva("carrito");

  const salir = () => {
    cerrarSesion();
    navegar("/");
  };

  return (
    <header>
      <div className="barra-superior py-1">
        <div className="container d-flex justify-content-end">
          <div className="text-white">
            {sesion ? (
              <>
                <span className="me-2">Hola, {sesion.nombre}</span>
                {sesion.tipo !== "Cliente" && (
                  <Link to="/admin" className="link-light me-2">
                    Panel de administración
                  </Link>
                )}
                <button
                  type="button"
                  className="btn btn-link link-light p-0 align-baseline"
                  onClick={salir}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              paginasEn("superior").map((p, i) => (
                <Fragment key={p.id}>
                  {i > 0 && <span className="text-white-50"> | </span>}
                  <Link to={p.ruta} className="link-light">
                    {p.titulo}
                  </Link>
                </Fragment>
              ))
            )}
          </div>
        </div>
      </div>

      <nav
        className="navbar navbar-expand-lg navbar-dark navbar-pz"
        aria-label="Menú principal"
      >
        <div className="container">
          <Link className="navbar-brand" to="/" onClick={cerrar}>
            <img src="/img/logo.svg" alt="" width={36} height={36} /> PixelZone
          </Link>

          {carritoActivo && (
            <Link
              className="boton-carrito ms-auto me-3 d-lg-none"
              to="/carrito"
              aria-label="Carrito"
            >
              <i className="bi bi-cart3" aria-hidden="true"></i>{" "}
              <span className="badge">{cantidadTotal}</span>
            </Link>
          )}

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="menu"
            aria-expanded={abierto}
            aria-label="Abrir menú"
            onClick={() => setAbierto(!abierto)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${abierto ? "show" : ""}`}
            id="menu"
          >
            <ul className="navbar-nav me-auto">
              {paginasEn("menu").map((p) => (
                <li className="nav-item" key={p.id}>
                  <NavLink
                    className="nav-link"
                    to={p.ruta}
                    end={p.ruta === "/"}
                    onClick={cerrar}
                  >
                    {p.titulo}
                  </NavLink>
                </li>
              ))}
            </ul>

            {carritoActivo && (
              <Link
                className="boton-carrito d-none d-lg-inline-block"
                to="/carrito"
                onClick={cerrar}
              >
                <i className="bi bi-cart3" aria-hidden="true"></i> Carrito{" "}
                <span className="badge">{cantidadTotal}</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
