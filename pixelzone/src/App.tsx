import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import CarritoProvider from "./context/CarritoProvider";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Producto from "./pages/Producto";
import Login from "./pages/Login";
import Carrito from "./pages/Carrito";

export default function App() {
  return (
    <BrowserRouter>
      <CarritoProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:codigo" element={<Producto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
        <Footer />
      </CarritoProvider>
    </BrowserRouter>
  );
}
