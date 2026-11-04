import type { SyntheticEvent } from "react";
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
const CLAVE_MENSAJES = "pz_mensajes";

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

// Imagen principal + dos vistas más: CON-001.webp, CON-001-b.webp, CON-001-c.webp
export function vistasProducto(imagen: string) {
  if (!imagen.startsWith("img/productos/")) return [imagen];
  const punto = imagen.lastIndexOf(".");
  const base = imagen.slice(0, punto);
  const extension = imagen.slice(punto);
  return [imagen, `${base}-b${extension}`, `${base}-c${extension}`];
}

// Si la foto del producto no existe, se muestra "sin-imagen" en vez de un ícono roto
const SIN_IMAGEN = "/img/productos/sin-imagen.svg";
export function alFallarImagen(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (!img.src.endsWith(SIN_IMAGEN)) img.src = SIN_IMAGEN;
}

// Quedan pocas unidades: stock mayor a 0 y menor o igual al stock crítico
export function ultimasUnidades(p: Producto) {
  return p.stock > 0 && p.stock <= Number(p.stockCritico || 0);
}

/* ---------- Mensajes del formulario de contacto (R.8) ---------- */
export interface MensajeContacto {
  nombre: string;
  correo: string;
  comentario: string;
  fecha: string;
}

export function obtenerMensajes(): MensajeContacto[] {
  try {
    const guardado = localStorage.getItem(CLAVE_MENSAJES);
    const lista: unknown = guardado ? JSON.parse(guardado) : [];
    return Array.isArray(lista) ? (lista as MensajeContacto[]) : [];
  } catch {
    return [];
  }
}

export function guardarMensaje(datos: Omit<MensajeContacto, "fecha">) {
  const mensajes = obtenerMensajes();
  mensajes.push({ ...datos, fecha: new Date().toISOString() });
  localStorage.setItem(CLAVE_MENSAJES, JSON.stringify(mensajes));
}

/* ---------- Reseñas de los blogs ---------- */
const CLAVE_RESENAS = "pz_resenas";

export interface Resena {
  blogId: string;
  nombre: string;
  calificacion: number; // 1 a 5 estrellas
  comentario: string;
  fecha: string;
}

function leerResenas(): Resena[] {
  try {
    const guardado = localStorage.getItem(CLAVE_RESENAS);
    const lista: unknown = guardado ? JSON.parse(guardado) : [];
    return Array.isArray(lista) ? (lista as Resena[]) : [];
  } catch {
    return [];
  }
}

// Reseñas de un blog, de la más nueva a la más antigua
export function obtenerResenas(blogId: string): Resena[] {
  return leerResenas()
    .filter((r) => r.blogId === blogId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function guardarResena(datos: Omit<Resena, "fecha">) {
  const resenas = leerResenas();
  resenas.push({ ...datos, fecha: new Date().toISOString() });
  localStorage.setItem(CLAVE_RESENAS, JSON.stringify(resenas));
}
