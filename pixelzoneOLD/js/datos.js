/* =========================================================
   datos.js - Datos iniciales de PixelZone (arreglos JS)
   La primera vez se copian a localStorage (ver almacen.js),
   así los cambios del administrador se ven en la tienda.
   ========================================================= */

const CATEGORIAS = ["Consolas", "Videojuegos", "Periféricos", "Accesorios", "Sillas gamer"];

const PRODUCTOS_INICIALES = [
  { codigo: "CON-001", nombre: "PlayStation 5 Slim 1TB", categoria: "Consolas", precio: 549990, stock: 8, stockCritico: 3,
    descripcion: "Consola de nueva generación con SSD de 1TB, lector de discos y control DualSense incluido. Juega en 4K y hasta 120 fps." },
  { codigo: "CON-002", nombre: "Xbox Series X 1TB", categoria: "Consolas", precio: 529990, stock: 5, stockCritico: 3,
    descripcion: "La Xbox más potente: 12 teraflops, 4K real y compatibilidad con miles de juegos de generaciones anteriores." },
  { codigo: "CON-003", nombre: "Nintendo Switch OLED", categoria: "Consolas", precio: 349990, stock: 12, stockCritico: 4,
    descripcion: "Pantalla OLED de 7 pulgadas, base con puerto LAN y 64 GB de almacenamiento. Juega en la TV o donde quieras." },
  { codigo: "CON-004", nombre: "Steam Deck OLED 512GB", categoria: "Consolas", precio: 599990, stock: 2, stockCritico: 3,
    descripcion: "Tu biblioteca de PC en formato portátil. Pantalla HDR OLED, más batería y conexión Wi-Fi 6E." },
  { codigo: "JUE-001", nombre: "EA Sports FC 26 (PS5)", categoria: "Videojuegos", precio: 59990, stock: 20, stockCritico: 5,
    descripcion: "La nueva temporada del fútbol con más de 700 equipos, modo Carrera renovado y Ultimate Team." },
  { codigo: "JUE-002", nombre: "Zelda: Tears of the Kingdom", categoria: "Videojuegos", precio: 54990, stock: 15, stockCritico: 5,
    descripcion: "Explora Hyrule por tierra y cielo. Construye vehículos, combina armas y descubre las islas flotantes." },
  { codigo: "JUE-003", nombre: "Elden Ring (PS5)", categoria: "Videojuegos", precio: 39990, stock: 0, stockCritico: 3,
    descripcion: "Mundo abierto de fantasía oscura creado por FromSoftware. Desafiante, enorme y lleno de secretos." },
  { codigo: "JUE-004", nombre: "Minecraft (Switch)", categoria: "Videojuegos", precio: 29990, stock: 25, stockCritico: 5,
    descripcion: "Construye, explora y sobrevive en mundos infinitos. Juega solo o con amigos en pantalla dividida." },
  { codigo: "PER-001", nombre: "Teclado mecánico HyperX Alloy Origins", categoria: "Periféricos", precio: 69990, stock: 10, stockCritico: 3,
    descripcion: "Switches mecánicos HyperX Red, cuerpo de aluminio e iluminación RGB por tecla." },
  { codigo: "PER-002", nombre: "Mouse Logitech G502 HERO", categoria: "Periféricos", precio: 44990, stock: 18, stockCritico: 4,
    descripcion: "Sensor HERO de 25.600 DPI, 11 botones programables y pesas ajustables." },
  { codigo: "PER-003", nombre: "Audífonos HyperX Cloud II", categoria: "Periféricos", precio: 79990, stock: 3, stockCritico: 3,
    descripcion: "Sonido envolvente 7.1 virtual, almohadillas de espuma viscoelástica y micrófono con cancelación de ruido." },
  { codigo: "PER-004", nombre: "Monitor Samsung Odyssey G5 27\"", categoria: "Periféricos", precio: 229990, stock: 6, stockCritico: 2,
    descripcion: "Monitor curvo QHD de 27 pulgadas, 165 Hz y 1 ms de respuesta. Ideal para shooters competitivos." },
  { codigo: "ACC-001", nombre: "Control DualSense Blanco", categoria: "Accesorios", precio: 64990, stock: 14, stockCritico: 4,
    descripcion: "Retroalimentación háptica y gatillos adaptativos para sentir cada juego en tus manos." },
  { codigo: "ACC-002", nombre: "Mousepad XL RGB", categoria: "Accesorios", precio: 19990, stock: 30, stockCritico: 5,
    descripcion: "Superficie de tela de 90 x 40 cm, base antideslizante y borde con iluminación RGB." },
  { codigo: "ACC-003", nombre: "Pack de wallpapers PixelZone", categoria: "Accesorios", precio: 0, stock: 999, stockCritico: 0,
    descripcion: "Producto de regalo: 10 fondos de pantalla en 4K para PC y celular. Agrégalo gratis a tu compra." },
  { codigo: "SIL-001", nombre: "Silla gamer Cougar Armor One", categoria: "Sillas gamer", precio: 199990, stock: 4, stockCritico: 2,
    descripcion: "Estructura de acero, cuero PVC transpirable, respaldo reclinable hasta 180° y cojines lumbar y cervical." },
  { codigo: "SIL-002", nombre: "Silla gamer Corsair TC100", categoria: "Sillas gamer", precio: 249990, stock: 7, stockCritico: 2,
    descripcion: "Asiento ancho de tela, apoyabrazos 2D y reclinación de 90° a 160° para largas sesiones." }
];

// Imagen por defecto de cada producto (archivos en img/productos/)
PRODUCTOS_INICIALES.forEach(p => { p.imagen = `img/productos/${p.codigo}.svg`; });

// Usuarios de prueba (contraseñas: admin123 / vende123 / clie123)
const USUARIOS_INICIALES = [
  { run: "123456785", nombre: "Ana", apellidos: "Rojas Muñoz", correo: "admin@duoc.cl", fechaNacimiento: "1995-04-12",
    tipo: "Administrador", region: "Biobío", comuna: "Concepción", direccion: "Av. Paicaví 123", password: "admin123" },
  { run: "176543213", nombre: "Bruno", apellidos: "Soto Pérez", correo: "vendedor@duoc.cl", fechaNacimiento: "1998-09-30",
    tipo: "Vendedor", region: "Biobío", comuna: "Talcahuano", direccion: "Colón 456", password: "vende123" },
  { run: "201234565", nombre: "Camila", apellidos: "Fuentes Vera", correo: "cliente@gmail.com", fechaNacimiento: "2002-01-20",
    tipo: "Cliente", region: "Región Metropolitana de Santiago", comuna: "Providencia", direccion: "Los Leones 789", password: "clie123" }
];

const ORDENES_INICIALES = [
  { numero: "OC-1001", fecha: "2026-09-10", cliente: "cliente@gmail.com", estado: "Entregada", total: 49980,
    items: [{ codigo: "JUE-004", nombre: "Minecraft (Switch)", precio: 29990, cantidad: 1 },
            { codigo: "ACC-002", nombre: "Mousepad XL RGB", precio: 19990, cantidad: 1 }] },
  { numero: "OC-1002", fecha: "2026-09-15", cliente: "cliente@gmail.com", estado: "En preparación", total: 44990,
    items: [{ codigo: "PER-002", nombre: "Mouse Logitech G502 HERO", precio: 44990, cantidad: 1 }] }
];

// Cupones de descuento del carrito (porcentaje en decimal)
const CUPONES = { GAMER10: 0.10, DUOC15: 0.15 };
