import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { REGIONES, comunasDe } from "../data/regiones";
import { guardarUsuarios, obtenerUsuarios } from "../utils/almacen";
import {
  contieneLetras,
  correoPermitido,
  fechaNacimientoValida,
  igualA,
  largoEntre,
  maxLargo,
  minLargo,
  requerido,
  runValido,
  sinEspacios,
  soloLetras,
  validar,
} from "../utils/validaciones";
import type { Regla } from "../utils/validaciones";

// El orden de esta lista es el orden del formulario (para enfocar el primer error)
const CAMPOS = [
  "run",
  "fechaNacimiento",
  "nombre",
  "apellidos",
  "correo",
  "password",
  "password2",
  "region",
  "comuna",
  "direccion",
] as const;

type Campo = (typeof CAMPOS)[number];
type Valores = Record<Campo, string>;

const VACIO: Valores = {
  run: "",
  fechaNacimiento: "",
  nombre: "",
  apellidos: "",
  correo: "",
  password: "",
  password2: "",
  region: "",
  comuna: "",
  direccion: "",
};

// Las reglas dependen de los valores actuales y de los usuarios ya registrados
function crearReglas(valores: Valores): Record<Campo, Regla[]> {
  const usuarios = obtenerUsuarios();
  return {
    run: [
      requerido("Ingresa el RUN."),
      runValido,
      (v) =>
        usuarios.some((u) => u.run === v.trim().toUpperCase())
          ? "Ya existe un usuario con este RUN."
          : "",
    ],
    fechaNacimiento: [fechaNacimientoValida],
    nombre: [requerido("Ingresa el nombre."), soloLetras, maxLargo(50)],
    apellidos: [requerido("Ingresa los apellidos."), soloLetras, maxLargo(100)],
    correo: [
      requerido("Ingresa el correo."),
      maxLargo(100),
      correoPermitido,
      (v) =>
        usuarios.some((u) => u.correo === v.trim().toLowerCase())
          ? "Este correo ya está registrado."
          : "",
    ],
    password: [
      requerido("Ingresa la contraseña."),
      sinEspacios,
      largoEntre(4, 10, "La contraseña"),
    ],
    password2: [
      requerido("Repite la contraseña."),
      igualA(() => valores.password, "Las contraseñas no coinciden."),
    ],
    region: [requerido("Selecciona una región.")],
    comuna: [requerido("Selecciona una comuna.")],
    direccion: [
      requerido("Ingresa la dirección."),
      minLargo(5),
      contieneLetras,
      maxLargo(300),
    ],
  };
}

function claseCampo(base: string, error: string, valor: string) {
  if (error) return `${base} is-invalid`;
  return valor.trim() !== "" ? `${base} is-valid` : base;
}

interface PropsCampoTexto {
  id: Campo;
  etiqueta: string;
  valor: string;
  error: string;
  alCambiar: (valor: string) => void;
  tipo?: string;
  ayuda?: string;
  opcional?: boolean;
  limite?: number;
  autoComplete?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  ancho?: string;
}

function CampoTexto({
  id,
  etiqueta,
  valor,
  error,
  alCambiar,
  tipo = "text",
  ayuda,
  opcional,
  limite,
  autoComplete,
  placeholder,
  min,
  max,
  ancho = "col-md-6",
}: PropsCampoTexto) {
  return (
    <div className={ancho}>
      <label htmlFor={id} className="form-label fw-semibold">
        {etiqueta}{" "}
        {opcional && (
          <span className="text-body-secondary fw-normal">(opcional)</span>
        )}
      </label>
      {limite !== undefined && (
        <small
          className={`float-end ${
            valor.length > limite ? "text-danger" : "text-body-secondary"
          }`}
        >
          {valor.length}/{limite}
        </small>
      )}
      <input
        type={tipo}
        className={claseCampo("form-control", error, valor)}
        id={id}
        name={id}
        value={valor}
        autoComplete={autoComplete}
        placeholder={placeholder}
        min={min}
        max={max}
        onChange={(e) => alCambiar(e.target.value)}
      />
      {ayuda && <div className="form-text">{ayuda}</div>}
      <div className="invalid-feedback">{error}</div>
    </div>
  );
}

export default function Registro() {
  const navegar = useNavigate();
  const [valores, setValores] = useState<Valores>(VACIO);
  const [errores, setErrores] = useState<Valores>(VACIO);
  const [creada, setCreada] = useState(false);

  const hoy = new Date().toISOString().slice(0, 10);

  const cambiar = (campo: Campo, valor: string) => {
    const nuevos: Valores = { ...valores, [campo]: valor };
    // Al cambiar la región, la comuna elegida deja de ser válida
    if (campo === "region") nuevos.comuna = "";
    setValores(nuevos);

    const reglas = crearReglas(nuevos);
    setErrores((prev) => {
      const sig: Valores = { ...prev, [campo]: validar(valor, reglas[campo]) };
      if (campo === "region") sig.comuna = "";
      // Si cambia la contraseña, se vuelve a revisar la confirmación
      if (campo === "password" && nuevos.password2 !== "") {
        sig.password2 = validar(nuevos.password2, reglas.password2);
      }
      return sig;
    });
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const reglas = crearReglas(valores);
    const nuevos = { ...VACIO };
    CAMPOS.forEach((c) => {
      nuevos[c] = validar(valores[c], reglas[c]);
    });
    setErrores(nuevos);

    const primero = CAMPOS.find((c) => nuevos[c] !== "");
    if (primero) {
      document.getElementById(primero)?.focus();
      return;
    }

    guardarUsuarios([
      ...obtenerUsuarios(),
      {
        run: valores.run.trim().toUpperCase(),
        nombre: valores.nombre.trim(),
        apellidos: valores.apellidos.trim(),
        correo: valores.correo.trim().toLowerCase(),
        fechaNacimiento: valores.fechaNacimiento,
        tipo: "Cliente", // desde la tienda siempre se crea un Cliente
        region: valores.region,
        comuna: valores.comuna,
        direccion: valores.direccion.trim(),
        password: valores.password,
      },
    ]);

    setValores(VACIO);
    setErrores(VACIO);
    setCreada(true);
    setTimeout(() => navegar("/login"), 1500);
  };

  return (
    <main>
      <div className="container py-5">
        <section className="caja-formulario mx-auto">
          <h1 className="h5 encabezado-formulario mb-0">Registro de usuario</h1>
          <form className="p-4" onSubmit={enviar} noValidate>
            <div className="row g-3">
              <CampoTexto
                id="run"
                etiqueta="RUN"
                valor={valores.run}
                error={errores.run}
                alCambiar={(v) => cambiar("run", v)}
                placeholder="123456785"
                autoComplete="off"
                ayuda="Sin puntos ni guion. Ej: 123456785"
              />
              <CampoTexto
                id="fechaNacimiento"
                etiqueta="Fecha de nacimiento"
                opcional
                tipo="date"
                valor={valores.fechaNacimiento}
                error={errores.fechaNacimiento}
                alCambiar={(v) => cambiar("fechaNacimiento", v)}
                min="1900-01-01"
                max={hoy}
              />
              <CampoTexto
                id="nombre"
                etiqueta="Nombre"
                valor={valores.nombre}
                error={errores.nombre}
                alCambiar={(v) => cambiar("nombre", v)}
                limite={50}
                autoComplete="given-name"
              />
              <CampoTexto
                id="apellidos"
                etiqueta="Apellidos"
                valor={valores.apellidos}
                error={errores.apellidos}
                alCambiar={(v) => cambiar("apellidos", v)}
                limite={100}
                autoComplete="family-name"
              />
              <CampoTexto
                id="correo"
                etiqueta="Correo"
                tipo="email"
                valor={valores.correo}
                error={errores.correo}
                alCambiar={(v) => cambiar("correo", v)}
                placeholder="nombre@duoc.cl"
                autoComplete="email"
                ayuda="Solo @duoc.cl, @profesor.duoc.cl o @gmail.com."
                ancho="col-12"
              />
              <CampoTexto
                id="password"
                etiqueta="Contraseña"
                tipo="password"
                valor={valores.password}
                error={errores.password}
                alCambiar={(v) => cambiar("password", v)}
                autoComplete="new-password"
                ayuda="Entre 4 y 10 caracteres, sin espacios."
              />
              <CampoTexto
                id="password2"
                etiqueta="Confirmar contraseña"
                tipo="password"
                valor={valores.password2}
                error={errores.password2}
                alCambiar={(v) => cambiar("password2", v)}
                autoComplete="new-password"
              />

              <div className="col-md-6">
                <label htmlFor="region" className="form-label fw-semibold">
                  Región
                </label>
                <select
                  className={claseCampo(
                    "form-select",
                    errores.region,
                    valores.region,
                  )}
                  id="region"
                  name="region"
                  value={valores.region}
                  onChange={(e) => cambiar("region", e.target.value)}
                >
                  <option value="">-- Seleccione la región --</option>
                  {REGIONES.map((r) => (
                    <option key={r.nombre} value={r.nombre}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">{errores.region}</div>
              </div>
              <div className="col-md-6">
                <label htmlFor="comuna" className="form-label fw-semibold">
                  Comuna
                </label>
                <select
                  className={claseCampo(
                    "form-select",
                    errores.comuna,
                    valores.comuna,
                  )}
                  id="comuna"
                  name="comuna"
                  value={valores.comuna}
                  disabled={valores.region === ""}
                  onChange={(e) => cambiar("comuna", e.target.value)}
                >
                  <option value="">-- Seleccione la comuna --</option>
                  {comunasDe(valores.region).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">{errores.comuna}</div>
              </div>

              <div className="col-12">
                <label htmlFor="direccion" className="form-label fw-semibold">
                  Dirección
                </label>
                <small
                  className={`float-end ${
                    valores.direccion.length > 300
                      ? "text-danger"
                      : "text-body-secondary"
                  }`}
                >
                  {valores.direccion.length}/300
                </small>
                <textarea
                  className={claseCampo(
                    "form-control",
                    errores.direccion,
                    valores.direccion,
                  )}
                  id="direccion"
                  name="direccion"
                  rows={3}
                  autoComplete="street-address"
                  value={valores.direccion}
                  onChange={(e) => cambiar("direccion", e.target.value)}
                />
                <div className="invalid-feedback">{errores.direccion}</div>
              </div>
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-pz btn-lg">
                Crear cuenta
              </button>
            </div>

            <div aria-live="polite" className="mt-3">
              {creada && (
                <div className="alert alert-success">
                  Cuenta creada. Te llevamos a iniciar sesión…
                </div>
              )}
            </div>

            <p className="text-center mb-0">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
