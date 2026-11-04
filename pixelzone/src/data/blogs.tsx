import type { ReactNode } from "react";

// Para agregar un blog nuevo basta con sumar un objeto aquí:
// la lista (/blogs) y el detalle (/blogs/:id) se generan solos.
// El archivo es .tsx para poder usar <em> dentro de los párrafos.
export interface Blog {
  id: string;
  titulo: string;
  tituloTarjeta: string;
  resumen: string;
  fecha: string; // formato ISO: AAAA-MM-DD
  autor: string;
  imagen: string;
  altImagen: string;
  parrafos: ReactNode[];
}

export const BLOGS: Blog[] = [
  {
    id: "primer-easter-egg",
    titulo: "El primer easter egg de la historia",
    tituloTarjeta: "Caso curioso #1: el primer easter egg de la historia",
    resumen:
      "En 1980 un programador de Atari escondió su nombre dentro de un juego porque la empresa no daba créditos. Así nació el “huevo de pascua” en los videojuegos.",
    fecha: "2026-09-08",
    autor: "Equipo PixelZone",
    imagen: "/img/blog/blog-1.svg",
    altImagen: "Huevo de pascua dibujado en pixel-art",
    parrafos: [
      <>
        A fines de los años 70, Atari no ponía el nombre de los programadores en
        sus juegos. Warren Robinett, creador de <em>Adventure</em> para la Atari
        2600 (1980), decidió firmar su trabajo de todas formas: escondió una sala
        secreta con el texto “Created by Warren Robinett”.
      </>,
      <>
        Para entrar había que encontrar un punto gris de un solo píxel, casi
        invisible, y llevarlo hasta un muro específico del castillo. Nadie en
        Atari lo sabía cuando el juego salió a la venta.
      </>,
      <>
        Cuando un jugador descubrió la sala y escribió a la empresa, Atari
        decidió no eliminarla. Incluso se empezó a hablar de estos secretos como
        “huevos de pascua”, porque había que buscarlos como en la tradicional
        búsqueda de huevos.
      </>,
      <>
        Desde entonces los easter eggs son parte de la cultura gamer: mensajes
        ocultos, niveles secretos y guiños a otros juegos que los desarrolladores
        dejan para los jugadores más curiosos.
      </>,
    ],
  },
  {
    id: "codigo-konami",
    titulo: "El código Konami",
    tituloTarjeta: "Caso curioso #2: el código Konami",
    resumen:
      "Arriba, arriba, abajo, abajo, izquierda, derecha, izquierda, derecha, B, A. Un truco pensado para probar un juego terminó siendo el código más famoso del mundo gamer.",
    fecha: "2026-09-15",
    autor: "Equipo PixelZone",
    imagen: "/img/blog/blog-2.svg",
    altImagen:
      "Secuencia de flechas: arriba, arriba, abajo, abajo, izquierda, derecha, izquierda, derecha",
    parrafos: [
      <>
        En 1986 Kazuhisa Hashimoto estaba adaptando el juego <em>Gradius</em>{" "}
        para la consola NES. El juego era tan difícil que, para probarlo, creó
        una combinación secreta que entregaba todas las mejoras de la nave.
      </>,
      <>
        La secuencia era: arriba, arriba, abajo, abajo, izquierda, derecha,
        izquierda, derecha, B, A. Al terminar el desarrollo olvidó quitarla y el
        truco llegó a las tiendas.
      </>,
      <>
        El código se hizo famoso con <em>Contra</em>, donde daba 30 vidas en
        lugar de 3. Muchos jugadores lograron terminar el juego gracias a él.
      </>,
      <>
        Hoy el código Konami aparece en decenas de juegos y hasta en sitios web
        como guiño a los fans. Es probable que lo encuentres escondido en más de
        una página que visitas.
      </>,
    ],
  },
];

export function buscarBlog(id: string | undefined) {
  return BLOGS.find((b) => b.id === id);
}

// "2026-09-08" -> "08-09-2026"
export function formatearFecha(fechaIso: string) {
  const [anio, mes, dia] = fechaIso.split("-");
  return `${dia}-${mes}-${anio}`;
}
