import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSesion } from "../../context/sesion";

export default function AdminLayout() {
  const { sesion, cerrar } = useSesion();
  const navigate = useNavigate();

  if (!sesion || sesion.tipo === "Cliente") return <Navigate to="/login" replace />;

  const soloAdmin = sesion.tipo === "Administrador";
  const salir = () => {
    cerrar();
    navigate("/");
  };

  return (
    <div className="admin-layout">
      <aside className="menu-lateral" aria-label="Menú de administración">
        <Link className="marca" to="/admin">
          <img src="/img/logo.svg" alt="" width={32} height={32} /> PixelZone
        </Link>
        <nav>
          <ul className="nav flex-column py-2">
            <li><NavLink className="nav-link" end to="/admin"><i className="bi bi-speedometer2" /> Dashboard</NavLink></li>
            <li><NavLink className="nav-link" to="/admin/productos"><i className="bi bi-controller" /> Productos</NavLink></li>
            <li><NavLink className="nav-link" to="/admin/ordenes"><i className="bi bi-receipt" /> Órdenes</NavLink></li>
            {soloAdmin && <li><NavLink className="nav-link" to="/admin/usuarios"><i className="bi bi-people" /> Usuarios</NavLink></li>}
            <li><Link className="nav-link" to="/"><i className="bi bi-shop" /> Ver tienda</Link></li>
          </ul>
        </nav>
        <div className="pie-menu">
          <div><span className="d-block fw-semibold">{sesion.nombre}</span><span className="text-white-50">{sesion.tipo}</span></div>
          <button type="button" className="btn btn-sm btn-outline-light mt-md-2" onClick={salir}>Cerrar sesión</button>
        </div>
      </aside>
      <main className="admin-contenido"><Outlet /></main>
    </div>
  );
}
