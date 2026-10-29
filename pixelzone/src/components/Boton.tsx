import type { ReactNode } from "react";

interface Props {
  clase?: string;
  children: ReactNode;
  alHacerClick: () => void; // dentro del parentesis va ir el tipo del parametro de entrada, el tipo despues de la flecha es el retorno de la funcion entrante
}

function Boton({ clase = "btn btn-pz btn-lg", children, alHacerClick }: Props) {
  return (
    <button type="submit" className={clase} onClick={alHacerClick}>
      {children}
    </button>
  );
}

export default Boton;
