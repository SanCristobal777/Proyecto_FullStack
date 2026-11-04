import { Link, useParams } from "react-router-dom";
import ResenasBlog from "../components/ResenasBlog";
import { buscarBlog, formatearFecha } from "../data/blogs";

// Reemplaza a blog-1.html y blog-2.html: una sola página para todos los blogs
export default function BlogDetalle() {
  const { id } = useParams();
  const blog = buscarBlog(id);

  if (!blog) {
    return (
      <main className="container">
        <div className="titulo-pagina">
          <h1 className="mb-1">Blog no encontrado</h1>
          <p className="text-body-secondary">
            El artículo que buscas no existe o fue eliminado.
          </p>
          <Link to="/blogs" className="btn btn-pz">
            Volver a Blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <nav aria-label="Ruta de navegación" className="mt-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/blogs">Blogs</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {blog.titulo}
            </li>
          </ol>
        </nav>

        <article className="articulo">
          <h1 className="mb-2">{blog.titulo}</h1>
          <p className="text-body-secondary">
            <time dateTime={blog.fecha}>{formatearFecha(blog.fecha)}</time> ·{" "}
            {blog.autor}
          </p>
          <img
            src={blog.imagen}
            alt={blog.altImagen}
            className="img-fluid imagen-articulo my-4 w-100"
            width={800}
            height={450}
          />
          <div className="texto-lectura">
            {blog.parrafos.map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
          <Link to="/blogs" className="btn btn-outline-secondary mt-3">
            Volver a Blogs
          </Link>
        </article>

        {/* key: al cambiar de blog se reinician las reseñas y el formulario */}
        <ResenasBlog key={blog.id} blogId={blog.id} />
      </div>
    </main>
  );
}
