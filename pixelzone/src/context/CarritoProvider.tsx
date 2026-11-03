import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CarritoContext } from "./carrito";
import type { ItemCarrito, Resultado } from "./carrito";
import { buscarProducto } from "../utils/almacen";

const CLAVE_CARRITO = "pz_carrito";

function leerCarrito(): ItemCarrito[] {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO) ?? "[]");
  } catch {
    return [];
  }
}

export default function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>(leerCarrito);
  const [aviso, setAviso] = useState<{
    mensaje: string;
    tipo: "success" | "warning";
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3000);
    return () => clearTimeout(t);
  }, [aviso]);

  const agregar = useCallback(
    (codigo: string, cantidad = 1): Resultado => {
      const p = buscarProducto(codigo);
      let resultado: Resultado;

      if (!p) {
        resultado = { ok: false, mensaje: "El producto no existe." };
      } else if (p.stock <= 0) {
        resultado = { ok: false, mensaje: `${p.nombre} está agotado.` };
      } else {
        const actual = items.find((i) => i.codigo === codigo)?.cantidad ?? 0;
        if (actual + cantidad > p.stock) {
          resultado = {
            ok: false,
            mensaje: `Solo quedan ${p.stock} unidades de ${p.nombre}.`,
          };
        } else {
          setItems((prev) =>
            prev.some((i) => i.codigo === codigo)
              ? prev.map((i) =>
                  i.codigo === codigo
                    ? { ...i, cantidad: i.cantidad + cantidad }
                    : i,
                )
              : [...prev, { codigo, cantidad }],
          );
          resultado = { ok: true, mensaje: `${p.nombre} agregado al carrito.` };
        }
      }
      setAviso({
        mensaje: resultado.mensaje,
        tipo: resultado.ok ? "success" : "warning",
      });
      return resultado;
    },
    [items],
  );

  // Suma o resta unidades (cambio = 1 o -1) respetando el stock
  const cambiarCantidad = useCallback(
    (codigo: string, cambio: number): Resultado => {
      const item = items.find((i) => i.codigo === codigo);
      const p = buscarProducto(codigo);
      if (!item || !p) {
        return { ok: false, mensaje: "El producto no está en el carrito." };
      }

      const nueva = item.cantidad + cambio;
      if (nueva < 1) {
        return { ok: false, mensaje: "La cantidad mínima es 1." };
      }
      if (nueva > p.stock) {
        const resultado: Resultado = {
          ok: false,
          mensaje: `Solo quedan ${p.stock} unidades de ${p.nombre}.`,
        };
        setAviso({ mensaje: resultado.mensaje, tipo: "warning" });
        return resultado;
      }

      setItems((prev) =>
        prev.map((i) => (i.codigo === codigo ? { ...i, cantidad: nueva } : i)),
      );
      return { ok: true, mensaje: "Cantidad actualizada." };
    },
    [items],
  );

  const eliminar = useCallback((codigo: string) => {
    setItems((prev) => prev.filter((i) => i.codigo !== codigo));
  }, []);

  const vaciar = useCallback(() => {
    setItems([]);
  }, []);

  const valor = useMemo(
    () => ({
      items,
      cantidadTotal: items.reduce((suma, i) => suma + i.cantidad, 0),
      agregar,
      cambiarCantidad,
      eliminar,
      vaciar,
    }),
    [items, agregar, cambiarCantidad, eliminar, vaciar],
  );

  return (
    <CarritoContext.Provider value={valor}>
      {children}
      {aviso && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1080 }}
        >
          <div
            className={`alert alert-${aviso.tipo} shadow mb-0`}
            role="status"
          >
            {aviso.mensaje}
          </div>
        </div>
      )}
    </CarritoContext.Provider>
  );
}
