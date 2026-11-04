import { Link } from "react-router-dom";
import { formatearPrecio, obtenerOrdenes, obtenerProductos, ultimasUnidades } from "../../utils/almacen";

export default function AdminDashboard() {
  const productos = obtenerProductos();
  const ordenes = obtenerOrdenes();
  const criticos = productos.filter(ultimasUnidades);
  const ventas = ordenes.reduce((total, orden) => total + orden.total, 0);
  const tarjetas: { icono: string; titulo: string; valor: string | number; ruta: string }[] = [
    { icono: "bi-controller", titulo: "Productos", valor: productos.length, ruta: "/admin/productos" },
    { icono: "bi-receipt", titulo: "Órdenes", valor: ordenes.length, ruta: "/admin/ordenes" },
    { icono: "bi-cash-coin", titulo: "Ventas registradas", valor: formatearPrecio(ventas), ruta: "/admin/ordenes" },
    { icono: "bi-exclamation-triangle", titulo: "Stock crítico", valor: criticos.length, ruta: "/admin/productos" },
  ];
  return <>
    <h1 className="mb-1">Panel de administración</h1>
    <p className="text-body-secondary mb-4">Resumen actual de PixelZone.</p>
    <div className="row g-3 mb-4">
      {tarjetas.map(({ icono, titulo, valor, ruta }) => <div className="col-sm-6 col-xl-3" key={titulo}><Link className="card resumen-card h-100 text-decoration-none" to={ruta}><div className="card-body"><i className={`bi ${icono} fs-2`} /><div className="text-body-secondary mt-2">{titulo}</div><strong className="fs-4">{valor}</strong></div></Link></div>)}
    </div>
    <section className="card"><div className="card-header fw-semibold">Productos con stock crítico</div>{criticos.length === 0 ? <div className="card-body">No hay productos con stock crítico.</div> : <ul className="list-group list-group-flush">{criticos.map((p) => <li className="list-group-item d-flex justify-content-between" key={p.codigo}><span>{p.nombre}</span><strong>{p.stock} unidades</strong></li>)}</ul>}</section>
  </>;
}
