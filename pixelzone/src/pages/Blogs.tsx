import TarjetaBlog from "../components/TarjetaBlog";
import { BLOGS } from "../data/blogs";

export default function Blogs() {
  return (
    <main>
      <div className="container">
        <h1 className="titulo-pagina">Noticias importantes</h1>
        {BLOGS.map((blog) => (
          <TarjetaBlog key={blog.id} blog={blog} />
        ))}
      </div>
    </main>
  );
}
