import { useState } from "react";
import type { FormEvent } from "react";
import Boton from "../components/Boton";
import { useSesion } from "../context/sesion";
import { guardarMensaje } from "../utils/almacen";
import {
  correoPermitido,
  maxLargo,
  requerido,
  validar,
} from "../utils/validaciones";
import type { Regla } from "../utils/validaciones";

type Campo = "nombre" | "correo" | "comentario";

// Reglas de la pauta (R.8)
const REGLAS: Record<Campo, Regla[]> = {
  nombre: [requerido("Ingresa el nombre."), maxLargo(100)],
  correo: [maxLargo(100), correoPermitido], // opcional
  comentario: [requerido("Escribe tu comentario."), maxLargo(500)],
};

const MAXIMOS: Record<Campo, number> = { nombre: 100, correo: 100, comentario: 500 };
const VACIO: Record<Campo, string> = { nombre: "", correo: "", comentario: "" };
const ORDEN: Campo[] = ["nombre", "correo", "comentario"];

function claseCampo(error: string, valor: string) {
  if (error) return "form-control is-invalid";
  return valor.trim() !== "" ? "form-control is-valid" : "form-control";
}

// Contador "45/500" que se pone rojo si se pasa del máximo
function Contador({ valor, max }: { valor: string; max: number }) {
  const clase = valor.length > max ? "text-danger" : "text-body-secondary";
  return (
    <small className={`float-end ${clase}`}>
      {valor.length}/{max}
    </small>
  );
}

export default function Contacto() {
  const { sesion } = useSesion();

  // Si hay sesión iniciada, se completan nombre y correo
  const [valores, setValores] = useState<Record<Campo, string>>(() =>
    sesion
      ? {
          nombre: `${sesion.nombre} ${sesion.apellidos}`.trim(),
          correo: sesion.correo,
          comentario: "",
        }
      : VACIO,
  );
  const [errores, setErrores] = useState<Record<Campo, string>>(VACIO);
  const [enviado, setEnviado] = useState(false);

  const cambiar = (campo: Campo, valor: string) => {
    setValores((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: validar(valor, REGLAS[campo]) }));
    setEnviado(false);
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const nuevos: Record<Campo, string> = {
      nombre: validar(valores.nombre, REGLAS.nombre),
      correo: validar(valores.correo, REGLAS.correo),
      comentario: validar(valores.comentario, REGLAS.comentario),
    };
    setErrores(nuevos);

    // Lleva el foco al primer campo con error
    const primero = ORDEN.find((c) => nuevos[c]);
    if (primero) {
      document.getElementById(primero)?.focus();
      return;
    }

    guardarMensaje({
      nombre: valores.nombre.trim(),
      correo: valores.correo.trim().toLowerCase(),
      comentario: valores.comentario.trim(),
    });
    setValores(VACIO);
    setErrores(VACIO);
    setEnviado(true);
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

        <section className="caja-formulario mx-auto">
          <h1 className="h5 encabezado-formulario mb-0">Formulario de contacto</h1>
          <form className="p-4" onSubmit={enviar} noValidate>
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="nombre" className="form-label fw-semibold">
                  Nombre completo
                </label>
                <Contador valor={valores.nombre} max={MAXIMOS.nombre} />
                <input
                  type="text"
                  className={claseCampo(errores.nombre, valores.nombre)}
                  id="nombre"
                  name="nombre"
                  autoComplete="name"
                  value={valores.nombre}
                  onChange={(e) => cambiar("nombre", e.target.value)}
                />
                <div className="invalid-feedback">{errores.nombre}</div>
              </div>

              <div className="col-12">
                <label htmlFor="correo" className="form-label fw-semibold">
                  Correo{" "}
                  <span className="text-body-secondary fw-normal">(opcional)</span>
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
                <label htmlFor="comentario" className="form-label fw-semibold">
                  Comentario
                </label>
                <Contador valor={valores.comentario} max={MAXIMOS.comentario} />
                <textarea
                  className={claseCampo(errores.comentario, valores.comentario)}
                  id="comentario"
                  name="comentario"
                  rows={5}
                  value={valores.comentario}
                  onChange={(e) => cambiar("comentario", e.target.value)}
                ></textarea>
                <div className="invalid-feedback">{errores.comentario}</div>
              </div>
            </div>

            <div className="d-grid mt-4">
              <Boton>Enviar mensaje</Boton>
            </div>

            <div aria-live="polite" className="mt-3">
              {enviado && (
                <div className="alert alert-success mb-0">
                  Mensaje enviado. Te responderemos dentro de 48 horas hábiles.
                </div>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
