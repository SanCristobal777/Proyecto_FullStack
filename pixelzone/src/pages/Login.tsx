import Boton from "../components/Boton";

function Login() {
  return (
    <>
      <div className="text-center mb-4">
        <img
          src="img/logo.svg"
          alt="Logo de PixelZone"
          className="logo-formulario"
        />
        <p className="h3 mt-2">PixelZone</p>
      </div>
      <section className="caja-formulario caja-angosta mx-auto">
        <h1 className="h5 encabezado-formulario mb-0">Inicio de sesión</h1>
        <form id="form-login" className="p-4">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-semibold">Correo</label>
              {/* <label for="correo" className="form-label fw-semibold">Correo</label> */}
              <input
                type="email"
                className="form-control"
                id="correo"
                name="correo" /*autocomplete="email"*/
              />
              <div className="form-text" id="correo-ayuda">
                Solo @duoc.cl, @profesor.duoc.cl o @gmail.com.
              </div>
              <div className="invalid-feedback" id="correo-error"></div>
            </div>
            <div className="col-12">
              <label /*for="password"*/ className="form-label fw-semibold">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password" /*autocomplete="current-password"*/
              />

              <div className="invalid-feedback" id="password-error"></div>
            </div>
          </div>
          <div className="d-grid mt-4">
            {/* <button type="submit" className="btn btn-pz btn-lg">
            Iniciar sesión
          </button> */}
            <Boton
              alHacerClick={() => {
                console.log("Iniciando sesion...");
              }}
            >
              Iniciar sesión
            </Boton>
          </div>
          <div id="resultado" className="mt-3" aria-live="polite"></div>
          <p className="text-center mb-0">
            ¿No tienes cuenta? <a href="registro.html">Regístrate</a>
          </p>
        </form>
      </section>
    </>
  );
}
export default Login;
