import { createContext, useContext } from "react";

export interface ItemCarrito {
  codigo: string;
  cantidad: number;
}

export interface Resultado {
  ok: boolean;
  mensaje: string;
}

export interface CarritoCtx {
  items: ItemCarrito[];
  cantidadTotal: number;
  agregar: (codigo: string, cantidad?: number) => Resultado;
  cambiarCantidad: (codigo: string, cambio: number) => Resultado;
  eliminar: (codigo: string) => void;
  vaciar: () => void;
}

export const CarritoContext = createContext<CarritoCtx | null>(null);

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
