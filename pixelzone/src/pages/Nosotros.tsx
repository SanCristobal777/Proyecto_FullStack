const EQUIPO = [
  { nombre: "Cristobal Olivares", rol: "Tienda, catálogo y carrito de compras" },
  { nombre: "Sebastian Escalona", rol: "Formularios, validaciones y región/comuna" },
  { nombre: "Flavio Bustos", rol: "Panel de administración, roles, Nosotros y Blogs" },
];

export default function Nosotros() {
  return (
    <main>
      <div className="container">
        <h1 className="titulo-pagina">Nosotros</h1>

        <section className="row g-5 align-items-center">
          <div className="col-lg-7 texto-lectura">
            <p className="lead">
              PixelZone nació en Concepción el 2026 como un proyecto de tres estudiantes de
              Duoc UC que querían una tienda gamer simple: precios claros, stock real y
              atención de personas que también juegan.
            </p>
            <p>
              Vendemos consolas, videojuegos, periféricos, accesorios y sillas gamer, y
              despachamos a las 16 regiones de Chile. En nuestro blog compartimos noticias y
              datos curiosos de la historia de los videojuegos.
            </p>
          </div>

          <div className="col-lg-5">
            <div className="row g-3">
              <div className="col-sm-6 col-lg-12">
                <div className="bg-white border p-3 h-100">
                  <h2 className="h5">Misión</h2>
                  <p className="mb-0">
                    Acercar el mundo gamer a todo Chile con productos originales, precios
                    justos y una compra fácil.
                  </p>
                </div>
              </div>
              <div className="col-sm-6 col-lg-12">
                <div className="bg-white border p-3 h-100">
                  <h2 className="h5">Visión</h2>
                  <p className="mb-0">
                    Ser la tienda gamer online preferida del sur de Chile al 2030.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5" aria-labelledby="titulo-equipo">
          <h2 id="titulo-equipo" className="mb-4">Equipo de desarrollo</h2>
          <div className="row g-4">
            {EQUIPO.map((m, i) => (
              <div key={m.nombre} className="col-md-4">
                <article className="text-center">
                  <img
                    src={`/img/equipo/integrante-${i + 1}.svg`}
                    alt={`Avatar de ${m.nombre}`}
                    className="avatar rounded-circle mb-3"
                    width={120}
                    height={120}
                  />
                  <h3 className="h5 mb-1">{m.nombre}</h3>
                  <p className="text-body-secondary">{m.rol}</p>
                </article>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}