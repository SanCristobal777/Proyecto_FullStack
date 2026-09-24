/* =========================================================
   regiones.js - Regiones y comunas de Chile
   Arreglo con las comunas principales de cada región.
   Si el docente entrega su propio arreglo, reemplazar REGIONES
   manteniendo la forma { nombre, comunas: [] }.
   ========================================================= */
const REGIONES = [
  { nombre: "Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre", "General Lagos"] },
  { nombre: "Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica", "Huara"] },
  { nombre: "Antofagasta", comunas: ["Antofagasta", "Mejillones", "Taltal", "Calama", "San Pedro de Atacama", "Tocopilla"] },
  { nombre: "Atacama", comunas: ["Copiapó", "Caldera", "Chañaral", "Vallenar", "Huasco"] },
  { nombre: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña", "Andacollo"] },
  { nombre: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Los Andes", "Quillota"] },
  { nombre: "Región Metropolitana de Santiago", comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "La Florida", "Puente Alto", "San Bernardo"] },
  { nombre: "Libertador General Bernardo O'Higgins", comunas: ["Rancagua", "Machalí", "San Fernando", "Rengo", "Pichilemu"] },
  { nombre: "Maule", comunas: ["Talca", "Curicó", "Linares", "Longaví", "Constitución", "Cauquenes"] },
  { nombre: "Ñuble", comunas: ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes", "Quirihue"] },
  { nombre: "Biobío", comunas: ["Concepción", "Talcahuano", "Hualpén", "San Pedro de la Paz", "Chiguayante", "Coronel", "Lota", "Tomé", "Los Ángeles"] },
  { nombre: "La Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"] },
  { nombre: "Los Ríos", comunas: ["Valdivia", "La Unión", "Panguipulli", "Río Bueno"] },
  { nombre: "Los Lagos", comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud"] },
  { nombre: "Aysén del General Carlos Ibáñez del Campo", comunas: ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane"] },
  { nombre: "Magallanes y de la Antártica Chilena", comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"] }
];

/* Llena un <select> de regiones y enlaza su <select> de comunas (R.17) */
function enlazarRegionComuna(selRegion, selComuna, regionInicial = "", comunaInicial = "") {
  selRegion.innerHTML = '<option value="">-- Seleccione la región --</option>' +
    REGIONES.map(r => `<option value="${r.nombre}">${r.nombre}</option>`).join("");

  function cargarComunas(comunaElegida = "") {
    const region = REGIONES.find(r => r.nombre === selRegion.value);
    selComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
    selComuna.disabled = !region;
    if (region) {
      selComuna.innerHTML += region.comunas.map(c => `<option value="${c}">${c}</option>`).join("");
      selComuna.value = comunaElegida;
    }
  }

  selRegion.addEventListener("change", () => cargarComunas());
  selRegion.value = regionInicial;
  cargarComunas(comunaInicial);
}
