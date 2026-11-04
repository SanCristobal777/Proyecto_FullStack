import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Boton from "../components/Boton";
import Seccion from "../components/Seccion";
import { estaActiva } from "../data/directorio";
import { useSesion } from "../context/sesion";
import { obtenerUsuarios } from "../utils/almacen";
import {
  correoPermitido,
  largoEntre,
  maxLargo,
  requerido,
  sinEspacios,
  validar,
} from "../utils/validaciones";
import type { Regla } from "../utils/validaciones";

type Campo = "correo" | "password";

const REGLAS: Record<Campo, Regla[]> = {
  correo: [requerido("Ingresa el correo."), maxLargo(100), correoPermitido],
  password: [
    requerido("Ingresa la contraseña."),
    sinEspacios,
    largoEntre(4, 10, "La contraseña"),
  ],
};

function claseCampo(error: string, valor: string) {
  if (error) return "form-control is-invalid";
  return valor.trim() !== "" ? "form-control is-valid" : "form-control";
}

function Login() {
  const navegar = useNavigate();
  const { iniciar } = useSesion();
  const [valores, setValores] = useState<Record<Campo, string>>({
    correo: "",
    password: "",
  });
  const [errores, setErrores] = useState<Record<Campo, string>>({
    correo: "",
    password: "",
  });
  const [mensaje, setMensaje] = useState<{
    tipo: "success" | "danger";
    texto: string;
  } | null>(null);

  const cambiar = (campo: Campo, valor: string) => {
    setValores((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: validar(valor, REGLAS[campo]) }));
    setMensaje(null);
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const nuevos: Record<Campo, string> = {
      correo: validar(valores.correo, REGLAS.correo),
      password: validar(valores.password, REGLAS.password),
    };
    setErrores(nuevos);

    if (nuevos.correo) {
      document.getElementById("correo")?.focus();
      return;
    }
    if (nuevos.password) {
      document.getElementById("password")?.focus();
      return;
    }

    const correo = valores.correo.trim().toLowerCase();
    const usuario = obtenerUsuarios().find(
      (u) => u.correo === correo && u.password === valores.password,
    );
    if (!usuario) {
      setMensaje({ tipo: "danger", texto: "Correo o contraseña incorrectos." });
      return;
    }

    iniciar(usuario);
    setMensaje({ tipo: "success", texto: `Bienvenido/a, ${usuario.nombre}.` });
    // Cuando exista el panel de administración, Administrador y Vendedor irán allá
    setTimeout(() => navegar(usuario.tipo === "Cliente" ? "/" : "/admin"), 800);
  };

  return (
    <main>
      <div className="container py-5">
        <div className="text-center mb-4">
          <img
            src="/img/logo.svg"
            alt="Logo de PixelZone"
            className="logo-formulario"
          />
          <p className="h3 mt-2">PixelZone</p>
        </div>

        <Seccion>
          <h1 className="h5 encabezado-formulario mb-0">Inicio de sesión</h1>
          <form className="p-4" onSubmit={enviar} noValidate>
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="correo" className="form-label fw-semibold">
                  Correo
                </label>
                <input
                  type="email"
                  className={claseCampo(errores.correo, valores.correo)}
                  id="correo"
                  name="correo"
                  autoComplete="email"
                  value={valores.correo}
                  onChange={(e) => cambiar("correo", e.target.value)}
                />
                <div className="form-text">
                  Solo @duoc.cl, @profesor.duoc.cl o @gmail.com.
                </div>
                <div className="invalid-feedback">{errores.correo}</div>
              </div>
              <div className="col-12">
                <label htmlFor="password" className="form-label fw-semibold">
                  Contraseña
                </label>
                <input
                  type="password"
                  className={claseCampo(errores.password, valores.password)}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={valores.password}
                  onChange={(e) => cambiar("password", e.target.value)}
                />
                <div className="invalid-feedback">{errores.password}</div>
              </div>
            </div>

            <div className="d-grid mt-4">
              <Boton>Iniciar sesión</Boton>
            </div>

            <div aria-live="polite" className="mt-3">
              {mensaje && (
                <div className={`alert alert-${mensaje.tipo}`}>
                  {mensaje.texto}
                </div>
              )}
            </div>

            {estaActiva("registro") && (
              <p className="text-center mb-0">
                ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
              </p>
            )}
          </form>
        </Seccion>

        <details className="caja-angosta mx-auto mt-3">
          <summary>Cuentas de prueba</summary>
          <ul className="mt-2">
            <li>Administrador: admin@duoc.cl / admin123</li>
            <li>Vendedor: vendedor@duoc.cl / vende123</li>
            <li>Cliente: cliente@gmail.com / clie123</li>
          </ul>
        </details>
      </div>
    </main>
  );
}

export default Login;
