import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { CATEGORIAS } from "../data/datos";

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

function validarCorreo(valor: string): string {
  const correo = valor.trim().toLowerCase();
  if (correo === "") return "Ingresa el correo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return "Escribe un correo válido, por ejemplo nombre@duoc.cl.";
  }
  if (!DOMINIOS_PERMITIDOS.some((d) => correo.endsWith(d))) {
    return "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  }
  return "";
}

export default function Footer() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const suscribir = (e: FormEvent) => {
    e.preventDefault();
    const mensaje = validarCorreo(correo);
    if (mensaje) {
      setError(mensaje);
      setEnviado(false);
      return;
    }
    setError("");
    setEnviado(true);
    setCorreo("");
  };

  return (
    <footer className="footer-pz mt-5 pt-5 pb-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <p className="h5 text-white">PixelZone</p>
            <p>
              Tienda gamer online. Consolas, videojuegos y periféricos con
              despacho a todo Chile.
            </p>
            <p className="medios-pago mb-0" aria-label="Medios de pago">
              <span>VISA</span> <span>Mastercard</span> <span>Webpay</span>
            </p>
          </div>

          <div className="col-6 col-md-2">
            <p className="h6 text-white">Categorías</p>
            <ul className="list-unstyled">
              {CATEGORIAS.map((c) => (
                <li key={c}>
                  <Link to={`/productos?categoria=${encodeURIComponent(c)}`}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <p className="h6 text-white">Tienda</p>
            <ul className="list-unstyled">
              <li>
                <Link to="/nosotros">Nosotros</Link>
              </li>
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
              <li>
                <Link to="/carrito">Carrito</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <form onSubmit={suscribir} noValidate>
              <label htmlFor="correoNews" className="form-label text-white">
                Recibe ofertas en tu correo
              </label>
              <div className="input-group has-validation">
                <input
                  type="email"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  id="correoNews"
                  placeholder="tucorreo@gmail.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <button className="btn btn-coral" type="submit">
                  Suscribirme
                </button>
                <div className="invalid-feedback">{error}</div>
              </div>
              {enviado && (
                <p className="small text-success mt-2 mb-0">
                  Listo, te avisaremos de las ofertas.
                </p>
              )}
            </form>
          </div>
        </div>
        <p className="small mt-4 mb-0 pt-3 border-top border-secondary">
          © 2026 PixelZone · Proyecto DSY1104 Desarrollo Fullstack · Duoc UC
        </p>
      </div>
    </footer>
  );
}
