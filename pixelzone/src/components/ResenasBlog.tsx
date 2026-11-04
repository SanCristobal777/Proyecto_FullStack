import { Fragment, useState } from "react";
import type { FormEvent } from "react";
import Boton from "./Boton";
import { useSesion } from "../context/sesion";
import { guardarResena, obtenerResenas } from "../utils/almacen";
import type { Resena } from "../utils/almacen";
import { maxLargo, minLargo, requerido, validar } from "../utils/validaciones";
import type { Regla } from "../utils/validaciones";

type Campo = "nombre" | "calificacion" | "comentario";

const REGLAS: Record<Campo, Regla[]> = {
  nombre: [requerido("Ingresa tu nombre."), maxLargo(50)],
  calificacion: [requerido("Elige de 1 a 5 estrellas.")],
  comentario: [requerido("Escribe tu reseña."), minLargo(10), maxLargo(300)],
};

const ORDEN: Campo[] = ["nombre", "calificacion", "comentario"];
const MAX_COMENTARIO = 300;
const TEXTO_ESTRELLAS = ["", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"];

function claseCampo(error: string, valor: string) {
  if (error) return "form-control is-invalid";
  return valor.trim() !== "" ? "form-control is-valid" : "form-control";
}

// Muestra ★★★★☆ (solo lectura)
function Estrellas({ valor }: { valor: number }) {
  const llenas = Math.round(valor);
  return (
    <span className="estrellas" role="img" aria-label={`${valor} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i
          key={n}
          className={`bi ${n <= llenas ? "bi-star-fill" : "bi-star"}`}
          aria-hidden="true"
        ></i>
      ))}
    </span>
  );
}

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ResenasBlog({ blogId }: { blogId: string }) {
  const { sesion } = useSesion();
  const nombreSesion = sesion ? sesion.nombre : "";

  const [resenas, setResenas] = useState<Resena[]>(() => obtenerResenas(blogId));
  const [valores, setValores] = useState<Record<Campo, string>>({
    nombre: nombreSesion,
    calificacion: "",
    comentario: "",
  });
  const [errores, setErrores] = useState<Record<Campo, string>>({
    nombre: "",
    calificacion: "",
    comentario: "",
  });
  const [enviado, setEnviado] = useState(false);

  const promedio =
    resenas.length > 0
      ? resenas.reduce((suma, r) => suma + r.calificacion, 0) / resenas.length
      : 0;

  const cambiar = (campo: Campo, valor: string) => {
    setValores((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: validar(valor, REGLAS[campo]) }));
    setEnviado(false);
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const nuevos: Record<Campo, string> = {
      nombre: validar(valores.nombre, REGLAS.nombre),
      calificacion: validar(valores.calificacion, REGLAS.calificacion),
      comentario: validar(valores.comentario, REGLAS.comentario),
    };
    setErrores(nuevos);

    const primero = ORDEN.find((c) => nuevos[c]);
    if (primero) {
      const id = primero === "calificacion" ? "estrella-5" : `resena-${primero}`;
      document.getElementById(id)?.focus();
      return;
    }

    guardarResena({
      blogId,
      nombre: valores.nombre.trim(),
      calificacion: Number(valores.calificacion),
      comentario: valores.comentario.trim(),
    });
    setResenas(obtenerResenas(blogId));
    setValores({ nombre: nombreSesion, calificacion: "", comentario: "" });
    setErrores({ nombre: "", calificacion: "", comentario: "" });
    setEnviado(true);
  };

  const elegida = Number(valores.calificacion);

  return (
    <section className="resenas mt-5 pt-4" aria-labelledby="titulo-resenas">
      <div className="d-flex flex-wrap align-items-baseline gap-3 mb-4">
        <h2 id="titulo-resenas" className="h3 mb-0">
          Comentarios y reseñas
        </h2>
        {resenas.length > 0 ? (
          <span className="text-body-secondary">
            <Estrellas valor={promedio} />{" "}
            <strong className="text-body">{promedio.toFixed(1)}</strong> ·{" "}
            {resenas.length} {resenas.length === 1 ? "reseña" : "reseñas"}
          </span>
        ) : (
          <span className="text-body-secondary">Aún no hay reseñas.</span>
        )}
      </div>

      <div className="row g-4">
        {/* ---------- Formulario ---------- */}
        <div className="col-lg-5">
          <div className="caja-formulario">
            <h3 className="h5 encabezado-formulario mb-0">Deja tu reseña</h3>
            <form className="p-4" onSubmit={enviar} noValidate>
              <div className="mb-3">
                <label htmlFor="resena-nombre" className="form-label fw-semibold">
                  Nombre
                </label>
                <input
                  type="text"
                  className={claseCampo(errores.nombre, valores.nombre)}
                  id="resena-nombre"
                  autoComplete="given-name"
                  value={valores.nombre}
                  onChange={(e) => cambiar("nombre", e.target.value)}
                />
                <div className="invalid-feedback">{errores.nombre}</div>
              </div>

              <fieldset className="mb-3">
                <legend className="form-label fw-semibold fs-6 mb-1">
                  Calificación
                </legend>
                <div
                  className={`selector-estrellas ${errores.calificacion ? "is-invalid" : ""}`}
                >
                  {/* Orden 5→1: el CSS (row-reverse) los muestra 1→5 */}
                  {[5, 4, 3, 2, 1].map((n) => (
                    <Fragment key={n}>
                      <input
                        type="radio"
                        className="visually-hidden"
                        name="calificacion"
                        id={`estrella-${n}`}
                        value={n}
                        checked={elegida === n}
                        onChange={(e) => cambiar("calificacion", e.target.value)}
                      />
                      <label htmlFor={`estrella-${n}`} title={TEXTO_ESTRELLAS[n]}>
                        <i
                          className={`bi ${elegida >= n ? "bi-star-fill" : "bi-star"}`}
                          aria-hidden="true"
                        ></i>
                        <span className="visually-hidden">
                          {n} {n === 1 ? "estrella" : "estrellas"}
                        </span>
                      </label>
                    </Fragment>
                  ))}
                </div>
                <div className="small mt-1">
                  {errores.calificacion ? (
                    <span className="text-danger">{errores.calificacion}</span>
                  ) : (
                    <span className="text-body-secondary">
                      {elegida ? TEXTO_ESTRELLAS[elegida] : "Toca una estrella."}
                    </span>
                  )}
                </div>
              </fieldset>

              <div className="mb-3">
                <label htmlFor="resena-comentario" className="form-label fw-semibold">
                  Comentario
                </label>
                <small
                  className={`float-end ${
                    valores.comentario.length > MAX_COMENTARIO
                      ? "text-danger"
                      : "text-body-secondary"
                  }`}
                >
                  {valores.comentario.length}/{MAX_COMENTARIO}
                </small>
                <textarea
                  className={claseCampo(errores.comentario, valores.comentario)}
                  id="resena-comentario"
                  rows={4}
                  value={valores.comentario}
                  onChange={(e) => cambiar("comentario", e.target.value)}
                ></textarea>
                <div className="invalid-feedback">{errores.comentario}</div>
              </div>

              <div className="d-grid">
                <Boton clase="btn btn-pz">Publicar reseña</Boton>
              </div>

              <div aria-live="polite">
                {enviado && (
                  <div className="alert alert-success mt-3 mb-0">
                    ¡Gracias! Tu reseña ya está publicada.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ---------- Lista de reseñas ---------- */}
        <div className="col-lg-7">
          {resenas.length === 0 ? (
            <p className="text-body-secondary">
              Sé el primero en comentar este artículo.
            </p>
          ) : (
            <ul className="list-unstyled d-grid gap-3 mb-0">
              {resenas.map((r) => (
                <li key={r.fecha} className="tarjeta-resena p-3">
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <strong>{r.nombre}</strong>
                    <time dateTime={r.fecha} className="small text-body-secondary">
                      {formatearFecha(r.fecha)}
                    </time>
                  </div>
                  <Estrellas valor={r.calificacion} />
                  <p className="mb-0 mt-2">{r.comentario}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
