import type { ComponentType } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import CarritoProvider from "./context/CarritoProvider";
import SesionProvider from "./context/SesionProvider";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Producto from "./pages/Producto";
import Login from "./pages/Login";
import Carrito from "./pages/Carrito";
import Registro from "./pages/Registro";
import NoEncontrada from "./pages/NoEncontrada";
import { paginasActivas } from "./data/directorio";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import BlogDetalle from "./pages/BlogDetalle";
import Contacto from "./pages/Contacto";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminProductoForm from "./pages/admin/AdminProductoForm";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminUsuarioForm from "./pages/admin/AdminUsuarioForm";
import AdminOrdenes from "./pages/admin/AdminOrdenes";
import "./css/admin.css";

// Cuando migres una página nueva, la agregas aquí y pones activa: true en el directorio
const COMPONENTES: Record<string, ComponentType> = {
  inicio: Inicio,
  productos: Productos,
  producto: Producto,
  login: Login,
  carrito: Carrito,
  registro: Registro,
  nosotros: Nosotros,
  blogs: Blogs,
  blog: BlogDetalle,
  contacto: Contacto,
};

function AppRoutes() {
  const rutas = paginasActivas().filter((p) => COMPONENTES[p.id]);
  const esAdmin = useLocation().pathname.startsWith("/admin");

  return (
    <>
      {!esAdmin && <NavBar />}
      <Routes>
        {rutas.map((p) => {
          const Componente = COMPONENTES[p.id];
          return <Route key={p.id} path={p.ruta} element={<Componente />} />;
        })}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="productos/nuevo" element={<AdminProductoForm />} />
          <Route path="productos/:codigo/editar" element={<AdminProductoForm />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="usuarios/nuevo" element={<AdminUsuarioForm />} />
          <Route path="usuarios/:run/editar" element={<AdminUsuarioForm />} />
          <Route path="ordenes" element={<AdminOrdenes />} />
        </Route>
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
      {!esAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SesionProvider>
        <CarritoProvider>
          <AppRoutes />
        </CarritoProvider>
      </SesionProvider>
    </BrowserRouter>
  );
}
