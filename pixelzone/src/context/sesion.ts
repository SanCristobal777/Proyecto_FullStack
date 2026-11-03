import { createContext, useContext } from "react";
import type { Usuario } from "../data/datos";
import type { Sesion } from "../utils/almacen";

export interface SesionCtx {
  sesion: Sesion | null;
  iniciar: (usuario: Usuario) => void;
  cerrar: () => void;
}

export const SesionContext = createContext<SesionCtx | null>(null);

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error("useSesion debe usarse dentro de SesionProvider");
  return ctx;
}
