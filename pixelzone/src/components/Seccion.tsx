import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Seccion({ children }: Props) {
  return (
    <section className="caja-formulario caja-angosta mx-auto">
      {children}
    </section>
  );
}

export default Seccion;
