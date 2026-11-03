import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCarrito } from "../context/carrito";

export default function NavBar() {
  const [abierto, setAbierto] = useState(false);
  const { cantidadTotal } = useCarrito();

  const cerrar = () => setAbierto(false);

  return (
    <header>
      <div className="barra-superior py-1">
        <div className="container d-flex justify-content-end">
          <div className="text-white">
            <Link to="/login" className="link-light">
              Iniciar sesión
            </Link>
            <span className="text-white-50"> | </span>
            <Link to="/registro" className="link-light">
              Registrar usuario
            </Link>
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

          <Link
            className="boton-carrito ms-auto me-3 d-lg-none"
            to="/carrito"
            aria-label="Carrito"
          >
            <i className="bi bi-cart3" aria-hidden="true"></i>{" "}
            <span className="badge">{cantidadTotal}</span>
          </Link>

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
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end onClick={cerrar}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/productos" onClick={cerrar}>
                  Productos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/nosotros" onClick={cerrar}>
                  Nosotros
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/blogs" onClick={cerrar}>
                  Blogs
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contacto" onClick={cerrar}>
                  Contacto
                </NavLink>
              </li>
            </ul>
            <Link
              className="boton-carrito d-none d-lg-inline-block"
              to="/carrito"
              onClick={cerrar}
            >
              <i className="bi bi-cart3" aria-hidden="true"></i> Carrito{" "}
              <span className="badge">{cantidadTotal}</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
