import type { Orden, Producto } from "../data/datos";

export interface Vendido {
  producto: Producto;
  vendidos: number;
}

// Productos más vendidos del año (suma de unidades en las órdenes).
// Si hay menos de "limite", se completa con productos disponibles sin ventas.
export function masVendidos(
  ordenes: Orden[],
  productos: Producto[],
  anio: number,
  limite = 8,
): Vendido[] {
  const unidades = new Map<string, number>();
  for (const orden of ordenes) {
    if (!orden.fecha.startsWith(`${anio}-`) || orden.estado === "Cancelada") continue;
    for (const item of orden.items) {
      unidades.set(item.codigo, (unidades.get(item.codigo) ?? 0) + item.cantidad);
    }
  }

  const ranking = productos
    .map((producto) => ({ producto, vendidos: unidades.get(producto.codigo) ?? 0 }))
    .filter((x) => x.vendidos > 0)
    .sort((a, b) => b.vendidos - a.vendidos || a.producto.nombre.localeCompare(b.producto.nombre));

  if (ranking.length >= limite) return ranking.slice(0, limite);

  const yaEstan = new Set(ranking.map((x) => x.producto.codigo));
  const relleno = productos
    .filter((p) => p.stock > 0 && !yaEstan.has(p.codigo))
    .map((producto) => ({ producto, vendidos: 0 }));
  return [...ranking, ...relleno].slice(0, limite);
}