import "bootstrap/dist/css/bootstrap.min.css";
import Boton from "./components/Boton";
import Seccion from "./components/Seccion";
import Login from "./pages/Login";

function App() {
  return (
    // <div className="card" style={{ width: "18rem" }}>
    //   <img src="..." className="card-img-top" alt="..." />
    //   <div className="card-body">
    //     <h5 className="card-title">Card title</h5>
    //     <p className="card-text">
    //       Some quick example text to build on the card title and make up the
    //       bulk of the card’s content.
    //     </p>
    //     <a href="#" className="btn btn-primary">
    //       Go somewhere
    //     </a>
    //   </div>
    // </div>
    <>
      <Seccion> Ejemplo </Seccion>
      <Login></Login>
      <Boton clase="btn btn-pz btn-lg"> iniciar sesion </Boton>
      <Boton clase="btn btn-pz btn-lg"> registro </Boton>
    </>
  );
}

export default App;
