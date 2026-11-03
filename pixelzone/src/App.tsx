import type { ComponentType } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Cuando migres una página nueva, la agregas aquí y pones activa: true en el directorio
const COMPONENTES: Record<string, ComponentType> = {
  inicio: Inicio,
  productos: Productos,
  producto: Producto,
  login: Login,
  carrito: Carrito,
  registro: Registro,
};

export default function App() {
  const rutas = paginasActivas().filter((p) => COMPONENTES[p.id]);

  return (
    <BrowserRouter>
      <SesionProvider>
        <CarritoProvider>
          <NavBar />
          <Routes>
            {rutas.map((p) => {
              const Componente = COMPONENTES[p.id];
              return (
                <Route key={p.id} path={p.ruta} element={<Componente />} />
              );
            })}
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
          <Footer />
        </CarritoProvider>
      </SesionProvider>
    </BrowserRouter>
  );
}
