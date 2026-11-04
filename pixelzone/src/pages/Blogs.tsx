import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import ResenasBlog from "../components/ResenasBlog";
import TarjetaBlog from "../components/TarjetaBlog";
import { BLOGS } from "../data/blogs";

export default function Blogs() {
  const { hash } = useLocation();
  const [parametros] = useSearchParams();
  const articulo = parametros.get("articulo") ?? "";

  // Si se llega con /blogs#resenas, baja directo al apartado de reseñas
  useEffect(() => {
    if (hash === "#resenas") {
      document.getElementById("resenas")?.scrollIntoView();
    }
  }, [hash]);

  return (
    <main>
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h1 className="titulo-pagina">Noticias importantes</h1>
          <a href="#resenas" className="btn btn-outline-secondary mb-4 mb-md-0">
            <i className="bi bi-chat-square-text" aria-hidden="true"></i> Ver reseñas
          </a>
        </div>

        {BLOGS.map((blog) => (
          <TarjetaBlog key={blog.id} blog={blog} />
        ))}

        {/* key: si cambia el artículo de la URL, el formulario se reinicia con él */}
        <ResenasBlog key={articulo} articuloInicial={articulo} />
      </div>
    </main>
  );
}
