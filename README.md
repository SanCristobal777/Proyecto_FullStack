# PixelZone – Tienda online gamer (React)

Proyecto de la **Evaluación Parcial 2 – DSY1104 Desarrollo Fullstack II (Duoc UC)**.

PixelZone es una tienda online de productos gamer (consolas, videojuegos, periféricos, accesorios y sillas gamer) con una parte pública para clientes y un panel de administración. En esta etapa, la plantilla original hecha con HTML, CSS, JavaScript y Bootstrap fue migrada a **React + TypeScript**, manteniendo el diseño responsivo con **Bootstrap 5**.

> La versión anterior (HTML/JS puro) se conserva en la carpeta `pixelzoneOLD/` solo como referencia.

## Integrantes

| Integrante | Responsabilidad principal |
|---|---|
| Cristobal Olivares | Home, Productos, Detalle y Carrito |
| Sebastian Escalona | Registro, Login, Contacto, validaciones y región/comuna |
| Flavio Bustos | Panel de administración, roles, Nosotros y Blogs |

## Tecnologías

| Tecnología | Uso |--Futuro
|---|---|
| React 19 + TypeScript | Construcción de la interfaz con componentes |
| Vite | Servidor de desarrollo y empaquetado |
| React Router DOM 7 | Navegación entre páginas y rutas anidadas del panel admin |
| Bootstrap 5.3 + Bootstrap Icons | Diseño responsivo (grilla, navbar, tablas, formularios) |
--| Context API | Estado global del carrito y de la sesión |
--| localStorage | Persistencia de productos, usuarios, órdenes, carrito, sesión, mensajes y reseñas |
--| ESLint | Control de calidad del código |

## Cómo ejecutar

Requisitos: **Node.js 20 o superior** y npm.

```bash
# 1. Clonar el repositorio y entrar a la carpeta de la app
cd pixelzone

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

La app queda disponible en la dirección que muestre la terminal (normalmente `http://localhost:5173`).

### Otros comandos

| Comando | Descripción |
|---|---|
| `npm run build` | Revisa los tipos con TypeScript y genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión de producción |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |

## Cuentas de prueba

| Perfil | Correo | Contraseña |
|---|---|---|
| Administrador | admin@duoc.cl | admin123 |
| Vendedor | vendedor@duoc.cl | vende123 |
| Cliente | cliente@gmail.com | clie123 |

Cupones del carrito: `GAMER10` (10 %) y `DUOC15` (15 %).

Para volver a los datos iniciales: DevTools → Application → Local Storage → borrar las claves que empiezan con `pz_`.

## Estructura del proyecto

```
pixelzone/
├── public/img/          # Imágenes de productos, blogs, equipo y logo
├── src/
│   ├── main.tsx         # Punto de entrada (importa Bootstrap y estilos)
│   ├── App.tsx          # Rutas de la aplicación y layout general
│   ├── components/      # Componentes reutilizables
│   │   ├── NavBar.tsx, Footer.tsx
│   │   ├── Boton.tsx, Seccion.tsx
│   │   ├── TarjetaProducto.tsx, TarjetaBlog.tsx
│   │   └── ResenasBlog.tsx
│   ├── pages/           # Una página por ruta
│   │   ├── Inicio, Productos, Producto, Carrito
│   │   ├── Login, Registro, Contacto
│   │   ├── Nosotros, Blogs, BlogDetalle, NoEncontrada
│   │   └── admin/       # Dashboard, Productos, Usuarios, Órdenes y sus formularios
│   ├── context/         # CarritoProvider y SesionProvider (Context API)
│   ├── utils/           # almacen.ts (localStorage), validaciones.ts, ventas.ts
│   ├── data/            # Datos iniciales, regiones/comunas y directorio de páginas
│   └── css/             # Estilos propios (estilos.css, admin.css)
└── index.html
```

## Funcionalidades

**Tienda pública**
- Home con productos destacados y más vendidos.
- Listado de productos con filtro por categorías y detalle de cada producto con galería de imágenes.
- Carrito de compras con control de stock, cantidades y cupones de descuento.
- Registro de usuarios con validación de RUN (módulo 11), correo por dominio permitido, y selección encadenada de región y comuna.
- Inicio de sesión con sesión persistente.
- Formulario de contacto, página Nosotros, blogs y reseñas por blog.
- Página 404 para rutas inexistentes.

**Panel de administración** (`/admin`)
- Acceso restringido por rol: los clientes son redirigidos al login.
- Dashboard con resumen de productos, órdenes, ventas y stock crítico.
- Gestión de productos (crear y editar) y consulta de órdenes con su detalle.
- Gestión de usuarios (crear, editar y eliminar), solo para el rol Administrador.

## Cómo se aplica React en el proyecto

- **Componentes con props tipadas:** por ejemplo `TarjetaProducto` recibe `producto`, `conBoton` y `vendidos`, y `Boton` recibe `clase`, `tipo` y `alHacerClick`.
- **Estado local con hooks:** `useState` en formularios (valores, errores y mensajes), `useMemo` en el listado de productos y `useEffect` para persistir y limpiar avisos.
- **Estado global con Context API:** `CarritoProvider` expone `agregar`, `cambiarCantidad`, `eliminar` y `vaciar`, y `SesionProvider` expone `iniciar` y `cerrar`. Se consumen con los hooks `useCarrito` y `useSesion`.
- **Navegación:** `react-router-dom` con rutas dinámicas (`/producto/:codigo`), rutas anidadas con `Outlet` (panel admin) y `Navigate` para proteger rutas.
- **Validaciones reutilizables:** `validaciones.ts` define reglas pequeñas (`requerido`, `maxLargo`, `runValido`, `correoPermitido`, etc.) que se combinan con `validar` en cada formulario.

## Diseño responsivo con Bootstrap

- Grilla con `row`, `col-md-*`, `col-lg-*` y `row-cols-*` para adaptar tarjetas y formularios al ancho de pantalla.
- Navbar con `navbar-expand-lg`, que se colapsa en móvil; el menú se abre y cierra con estado de React (no se usa el JavaScript de Bootstrap).
- Tablas del panel admin con `table-responsive`.
- Metaetiqueta `viewport` declarada en `index.html`.

## Pruebas

El proceso de pruebas unitarias (Jasmine y Karma) se incorporará en una etapa posterior del curso.
