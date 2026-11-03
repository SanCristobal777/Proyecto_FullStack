import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { SesionContext } from "./sesion";
import type { Usuario } from "../data/datos";
import { cerrarSesion, iniciarSesion, obtenerSesion } from "../utils/almacen";
import type { Sesion } from "../utils/almacen";

export default function SesionProvider({ children }: { children: ReactNode }) {
  // Al cargar la página se lee la sesión guardada, así sobrevive a F5
  const [sesion, setSesion] = useState<Sesion | null>(obtenerSesion);

  const iniciar = useCallback((usuario: Usuario) => {
    iniciarSesion(usuario);
    setSesion(obtenerSesion());
  }, []);

  const cerrar = useCallback(() => {
    cerrarSesion();
    setSesion(null);
  }, []);

  const valor = useMemo(
    () => ({ sesion, iniciar, cerrar }),
    [sesion, iniciar, cerrar],
  );

  return (
    <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
  );
}
