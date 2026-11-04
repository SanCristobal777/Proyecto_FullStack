import { Link } from "react-router-dom";
import { useSesion } from "../../context/sesion";
import { formatearPrecio, obtenerProductos, rutaImagen, ultimasUnidades } from "../../utils/almacen";

export default function AdminProductos() {
  const { sesion } = useSesion();
  const productos = obtenerProductos();
  return <>
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"><h1 className="mb-0">Productos</h1>{sesion?.tipo === "Administrador" && <Link className="btn btn-pz" to="/admin/productos/nuevo"><i className="bi bi-plus-lg" /> Nuevo producto</Link>}</div>
    <div className="table-responsive"><table className="table table-hover align-middle tabla-admin mb-0"><thead><tr><th>Imagen</th><th>Código</th><th>Nombre</th><th>Categoría</th><th className="text-end">Precio</th><th className="text-end">Stock</th><th className="text-end">Acciones</th></tr></thead><tbody>{productos.map((p) => <tr key={p.codigo}><td><img className="miniatura-tabla" src={rutaImagen(p.imagen)} alt="" /></td><td><code>{p.codigo}</code></td><td>{p.nombre}</td><td>{p.categoria}</td><td className="text-end">{formatearPrecio(p.precio)}</td><td className="text-end">{ultimasUnidades(p) ? <span className="badge text-bg-warning">{p.stock}</span> : p.stock}</td><td className="text-end text-nowrap"><Link className="btn btn-sm btn-outline-secondary" to={`/producto/${p.codigo}`}>Ver</Link>{sesion?.tipo === "Administrador" && <Link className="btn btn-sm btn-outline-dark ms-1" to={`/admin/productos/${p.codigo}/editar`}>Editar</Link>}</td></tr>)}</tbody></table></div>
  </>;
}
