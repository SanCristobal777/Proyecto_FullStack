export default function Carrito() {
  return (
    <main>
      <div className="container">
        <h1 className="titulo-pagina">Mi carrito de compras</h1>
        <div className="row g-4">
          <section className="col-lg-8" aria-label="Productos en el carrito">
            <p>Aquí irán los productos.</p>
          </section>
          <aside className="col-lg-4">
            <div className="resumen-compra bg-white p-4">
              <h2 className="h5">Resumen</h2>
              <dl className="mb-3">
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                  <dt className="h5">Total</dt>
                  <dd className="h4 precio mb-0">$0</dd>
                </div>
              </dl>
              <div className="d-grid">
                <button type="button" className="btn btn-pz btn-lg" disabled>
                  Pagar
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
