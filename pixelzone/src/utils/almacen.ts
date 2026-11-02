import { PRODUCTOS_INICIALES } from "../data/datos";
import type { Producto } from "../data/datos";

const CLAVE_PRODUCTOS = "pz_productos";

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

export function rutaImagen(ruta: string) {
  return ruta.startsWith("data:") || ruta.startsWith("/") ? ruta : "/" + ruta;
}

export function formatearPrecio(precio: number) {
  return precio === 0 ? "GRATIS" : "$" + precio.toLocaleString("es-CL");
}