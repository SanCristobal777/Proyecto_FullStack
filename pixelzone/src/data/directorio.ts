export type Zona = "superior" | "menu" | "footer";

export interface Pagina {
  id: string;
  ruta: string;
  titulo: string;
  activa: boolean; // true = visible y con ruta, false = apagada
  zonas: Zona[]; // dónde aparece el enlace ([] = no aparece en menús)
}

// El orden de esta lista es el orden en que salen los enlaces
export const DIRECTORIO: Pagina[] = [
  { id: "inicio", ruta: "/", titulo: "Home", activa: true, zonas: ["menu"] },
  {
    id: "productos",
    ruta: "/productos",
    titulo: "Productos",
    activa: true,
    zonas: ["menu"],
  },
  {
    id: "producto",
    ruta: "/producto/:codigo",
    titulo: "Detalle de producto",
    activa: true,
    zonas: [],
  },
  {
    id: "nosotros",
    ruta: "/nosotros",
    titulo: "Nosotros",
    activa: false,
    zonas: ["menu", "footer"],
  },
  {
    id: "blogs",
    ruta: "/blogs",
    titulo: "Blogs",
    activa: true,
    zonas: ["menu", "footer"],
  },
  {
    id: "blog",
    ruta: "/blogs/:id",
    titulo: "Detalle de blog",
    activa: false,
    zonas: [],
  },
  {
    id: "contacto",
    ruta: "/contacto",
    titulo: "Contacto",
    activa: false,
    zonas: ["menu", "footer"],
  },
  {
    id: "carrito",
    ruta: "/carrito",
    titulo: "Carrito",
    activa: true,
    zonas: ["footer"],
  },
  {
    id: "login",
    ruta: "/login",
    titulo: "Iniciar sesión",
    activa: true,
    zonas: ["superior"],
  },
  {
    id: "registro",
    ruta: "/registro",
    titulo: "Registrar usuario",
    activa: false,
    zonas: ["superior"],
  },
];

export const paginasActivas = () => DIRECTORIO.filter((p) => p.activa);

export const paginasEn = (zona: Zona) =>
  paginasActivas().filter((p) => p.zonas.includes(zona));

export const estaActiva = (id: string) =>
  DIRECTORIO.some((p) => p.id === id && p.activa);
