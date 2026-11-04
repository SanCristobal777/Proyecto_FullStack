import { Link } from "react-router-dom";
import type { Blog } from "../data/blogs";

interface Props {
  blog: Blog;
}

// Tarjeta del listado: texto a la izquierda, imagen a la derecha
export default function TarjetaBlog({ blog }: Props) {
  return (
    <article className="tarjeta-blog row g-0 align-items-stretch mb-4">
      <div className="col-md-6 p-4 p-lg-5 d-flex flex-column">
        <h2 className="h3">{blog.tituloTarjeta}</h2>
        <p>{blog.resumen}</p>
        <Link
          to={`/blogs/${blog.id}`}
          className="btn btn-pz align-self-start mt-auto"
        >
          Ver caso
        </Link>
      </div>
      <div className="col-md-6">
        <img
          src={blog.imagen}
          alt=""
          className="w-100 h-100 imagen-articulo"
          width={800}
          height={450}
        />
      </div>
    </article>
  );
}
