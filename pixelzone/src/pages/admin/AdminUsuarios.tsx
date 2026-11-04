import { useState } from "react";
import { Link } from "react-router-dom";
import { useSesion } from "../../context/sesion";
import { guardarUsuarios, obtenerUsuarios } from "../../utils/almacen";

export default function AdminUsuarios() {
  const { sesion } = useSesion(); const [version, setVersion] = useState(0);
  if (sesion?.tipo !== "Administrador") return <div className="alert alert-danger">No tienes permisos para administrar usuarios.</div>;
  const usuarios = obtenerUsuarios();
  const eliminar = (run: string) => { if (run === sesion.run) return; if (window.confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) { guardarUsuarios(usuarios.filter((u) => u.run !== run)); setVersion((v) => v + 1); } };
  void version;
  return <><div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"><h1 className="mb-0">Usuarios</h1><Link className="btn btn-pz" to="/admin/usuarios/nuevo"><i className="bi bi-person-plus" /> Nuevo usuario</Link></div><div className="table-responsive"><table className="table table-hover align-middle tabla-admin mb-0"><thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th><th>Ubicación</th><th className="text-end">Acciones</th></tr></thead><tbody>{usuarios.map((u) => <tr key={u.run}><td><code>{u.run}</code></td><td>{u.nombre} {u.apellidos}</td><td>{u.correo}</td><td><span className="badge text-bg-secondary">{u.tipo}</span></td><td>{u.comuna}, {u.region}</td><td className="text-end text-nowrap"><Link className="btn btn-sm btn-outline-dark" to={`/admin/usuarios/${u.run}/editar`}>Editar</Link><button className="btn btn-sm btn-outline-danger ms-1" disabled={u.run === sesion.run} onClick={() => eliminar(u.run)}>Eliminar</button></td></tr>)}</tbody></table></div></>;
}
