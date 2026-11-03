// Cada regla recibe el valor y devuelve "" si está bien o el mensaje de error.
export type Regla = (valor: string) => string;

export const DOMINIOS_PERMITIDOS = [
  "@duoc.cl",
  "@profesor.duoc.cl",
  "@gmail.com",
];

/* ---------- Reglas básicas ---------- */
export const requerido =
  (mensaje: string): Regla =>
  (v) =>
    v.trim() === "" ? mensaje : "";

export const maxLargo =
  (n: number): Regla =>
  (v) =>
    v.trim().length > n
      ? `Máximo ${n} caracteres (llevas ${v.trim().length}).`
      : "";

export const minLargo =
  (n: number): Regla =>
  (v) =>
    v.trim() !== "" && v.trim().length < n ? `Mínimo ${n} caracteres.` : "";

export const largoEntre =
  (min: number, max: number, nombre: string): Regla =>
  (v) => {
    if (v.length === 0) return "";
    return v.length < min || v.length > max
      ? `${nombre} debe tener entre ${min} y ${max} caracteres.`
      : "";
  };

// Evita contraseñas como "    " (solo espacios) o con espacios en medio
export const sinEspacios: Regla = (v) =>
  /\s/.test(v) ? "No puede contener espacios." : "";

// Letras (con tildes y ñ), espacios, apóstrofe y guion: rechaza "123", "0000" o "!!!"
export const soloLetras: Regla = (v) => {
  const texto = v.trim();
  if (texto === "") return "";
  return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+([ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/.test(texto)
    ? ""
    : "Solo letras y espacios, sin números ni símbolos.";
};

/* ---------- Correo ---------- */
export const correoPermitido: Regla = (v) => {
  const correo = v.trim().toLowerCase();
  if (correo === "") return "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return "Escribe un correo válido, por ejemplo nombre@duoc.cl.";
  }
  if (!DOMINIOS_PERMITIDOS.some((d) => correo.endsWith(d))) {
    // Sugerencia para errores comunes de tipeo
    if (correo.endsWith("@gmail.cl") || correo.endsWith("@gmial.com")) {
      return "¿Quisiste decir @gmail.com?";
    }
    if (correo.endsWith("@duocuc.cl")) return "¿Quisiste decir @duoc.cl?";
    return "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  }
  return "";
};

/* ---------- RUN chileno (sin puntos ni guion), validado con módulo 11 ---------- */
export function calcularDv(cuerpo: string): string {
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

export const runValido: Regla = (v) => {
  const run = v.trim().toUpperCase();
  if (run === "") return "";
  if (/[.-]/.test(run))
    return "Escribe el RUN sin puntos ni guion. Ej: 123456785.";
  if (!/^\d+[0-9K]$/.test(run)) {
    return "Solo números y el dígito verificador (0-9 o K) al final.";
  }
  if (run.length < 8 || run.length > 9) {
    return "El RUN debe tener 8 o 9 caracteres (con el dígito verificador).";
  }
  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);
  // Rechaza RUN en cero o imposibles, como 000000000
  if (Number(cuerpo) < 1_000_000) return "El RUN no es válido.";
  const esperado = calcularDv(cuerpo);
  if (dv !== esperado) {
    return `El RUN no es válido: el dígito verificador debería ser ${esperado}.`;
  }
  return "";
};

/* ---------- Fecha ---------- */
// Campo opcional: si viene vacío no se valida
export const fechaNacimientoValida: Regla = (v) => {
  if (v === "") return "";
  const fecha = new Date(v);
  if (Number.isNaN(fecha.getTime()) || fecha.getFullYear() < 1900) {
    return "Ingresa una fecha válida.";
  }
  return fecha > new Date() ? "La fecha no puede ser futura." : "";
};

/* ---------- Comparación con otro campo ---------- */
export const igualA =
  (obtenerOtro: () => string, mensaje: string): Regla =>
  (v) =>
    v !== obtenerOtro() ? mensaje : "";

/* ---------- Motor: devuelve el primer error, o "" si todo está bien ---------- */
export function validar(valor: string, reglas: Regla[]): string {
  for (const regla of reglas) {
    const error = regla(valor);
    if (error !== "") return error;
  }
  return "";
}
