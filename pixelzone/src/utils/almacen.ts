import {
  ORDENES_INICIALES,
  PRODUCTOS_INICIALES,
  USUARIOS_INICIALES,
} from "../data/datos";
import type { Orden, Producto, TipoUsuario, Usuario } from "../data/datos";

const CLAVE_PRODUCTOS = "pz_productos";
const CLAVE_ORDENES = "pz_ordenes";
const CLAVE_USUARIOS = "pz_usuarios";
const CLAVE_SESION = "pz_sesion";

export interface Sesion {
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  tipo: TipoUsuario;
}

export function guardarProductos(productos: Producto[]) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}

// La primera vez copia los productos iniciales a localStorage
export function obtenerProductos(): Producto[] {
  try {
    const guardado = localStorage.getItem(CLAVE_PRODUCTOS);
    if (guardado) return JSON.parse(guardado) as Producto[];
  } catch {
    /* si el JSON está dañado se vuelve a sembrar */
  }
  guardarProductos(PRODUCTOS_INICIALES);
  return PRODUCTOS_INICIALES;
}

export function buscarProducto(codigo: string | null | undefined) {
  return obtenerProductos().find((p) => p.codigo === codigo);
}

export function guardarOrdenes(ordenes: Orden[]) {
  localStorage.setItem(CLAVE_ORDENES, JSON.stringify(ordenes));
}

// La primera vez copia las órdenes de ejemplo a localStorage
export function obtenerOrdenes(): Orden[] {
  try {
    const guardado = localStorage.getItem(CLAVE_ORDENES);
    if (guardado) return JSON.parse(guardado) as Orden[];
  } catch {
    /* si el JSON está dañado se vuelve a sembrar */
  }
  guardarOrdenes(ORDENES_INICIALES);
  return ORDENES_INICIALES;
}

export function guardarUsuarios(usuarios: Usuario[]) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// La primera vez copia los usuarios de prueba a localStorage
export function obtenerUsuarios(): Usuario[] {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIOS);
    if (guardado) {
      const lista: unknown = JSON.parse(guardado);
      if (Array.isArray(lista)) return lista as Usuario[];
    }
  } catch {
    /* si el JSON está dañado se vuelve a sembrar */
  }
  guardarUsuarios(USUARIOS_INICIALES);
  return USUARIOS_INICIALES;
}

// Guarda en la sesión solo los datos necesarios (nunca la contraseña)
export function iniciarSesion(usuario: Usuario) {
  const { run, nombre, apellidos, correo, tipo } = usuario;
  const sesion: Sesion = { run, nombre, apellidos, correo, tipo };
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

// Devuelve el usuario con sesión iniciada, o null si no hay
export function obtenerSesion(): Sesion | null {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION);
    return guardada ? (JSON.parse(guardada) as Sesion) : null;
  } catch {
    return null;
  }
}

export function rutaImagen(ruta: string) {
  return ruta.startsWith("data:") || ruta.startsWith("/") ? ruta : "/" + ruta;
}

export function formatearPrecio(precio: number) {
  return precio === 0 ? "GRATIS" : "$" + precio.toLocaleString("es-CL");
}
