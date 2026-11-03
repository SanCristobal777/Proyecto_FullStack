import type { ReactNode } from "react";

interface Props {
  clase?: string;
  children: ReactNode;
  alHacerClick?: () => void; // opcional: dentro de un formulario basta con el onSubmit
  tipo?: "submit" | "button";
}

function Boton({
  clase = "btn btn-pz btn-lg",
  children,
  alHacerClick,
  tipo = "submit",
}: Props) {
  return (
    <button type={tipo} className={clase} onClick={alHacerClick}>
      {children}
    </button>
  );
}

export default Boton;
