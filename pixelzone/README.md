# PixelZone – Tienda online gamer

Proyecto de la **Evaluación Parcial 1 – DSY1104 Desarrollo Fullstack (Duoc UC)**.
Tienda online de productos gamer hecha con **HTML5, CSS3, JavaScript y Bootstrap 5.3**, con una parte pública (tienda) y un panel de administración.

## Integrantes

| Integrante | Responsabilidad principal | Requerimientos |
|---|---|---|
| Cristobal Olivares | Home, Productos, Detalle y Carrito | R.1 – R.5 |
| Sebastian Escalona | Registro, Login, Contacto, validaciones y región/comuna | R.6 – R.8, R.17, R.19 |
| Flavio Bustos | Panel de administración, roles, Nosotros y Blogs | R.9 – R.16, R.18 |

## Cómo ejecutar

1. Clonar el repositorio.
2. Abrir `index.html` en el navegador, o usar la extensión **Live Server** de VS Code.
3. Se necesita internet para cargar Bootstrap, los íconos y las fuentes desde su CDN.

### Cuentas de prueba

| Perfil | Correo | Contraseña |
|---|---|---|
| Administrador | admin@duoc.cl | admin123 |
| Vendedor | vendedor@duoc.cl | vende123 |
| Cliente | cliente@gmail.com | clie123 |

Cupones del carrito: `GAMER10` (10%) y `DUOC15` (15%).

Para volver a los datos iniciales: DevTools → Application → Local Storage → borrar las claves que empiezan con `pz_`.

## Estructura del proyecto

```
pixelzone/
├── index.html            Home
├── productos.html        Catálogo con filtro por categoría
├── producto.html         Detalle (producto.html?codigo=CON-001)
├── carrito.html          Carrito de compras
├── registro.html         Registro de usuario
├── login.html            Inicio de sesión
├── nosotros.html         Empresa y equipo
├── blogs.html            Noticias
├── blog-1.html           Detalle blog #1
├── blog-2.html           Detalle blog #2
├── contacto.html         Formulario de contacto
├── admin/
│   ├── index.html        Home del panel (menú lateral)
│   ├── productos.html    Listado de productos
│   ├── producto-form.html Nuevo / editar producto
│   ├── usuarios.html     Listado de usuarios
│   ├── usuario-form.html Nuevo / editar usuario
│   └── ordenes.html      Listado de órdenes
├── css/
│   ├── estilos.css       Hoja de estilos propia (variables, responsivo)
│   └── admin.css         Estilos del panel
├── js/
│   ├── datos.js          Arreglos de productos, usuarios, órdenes y cupones
│   ├── regiones.js       Arreglo de regiones/comunas y select dependiente
│   ├── almacen.js        localStorage: productos, usuarios, sesión y carrito
│   ├── validaciones.js   Reglas de negocio y validación en tiempo real
│   ├── tienda.js         Home, catálogo, detalle y carrito
│   ├── formularios.js    Registro, login, contacto y newsletter
│   └── admin.js          Control de acceso y mantenedores
└── img/                  Imágenes en SVG (productos, blog, equipo, logo)
```

## Datos y localStorage

La primera vez que se abre el sitio, los arreglos de `datos.js` se copian a localStorage. Desde ahí se leen y guardan todos los cambios, por eso lo que crea el administrador aparece en la tienda.

| Clave | Contenido |
|---|---|
| `pz_productos` | Productos |
| `pz_usuarios` | Usuarios |
| `pz_ordenes` | Órdenes (se crean al pagar el carrito) |
| `pz_sesion` | Usuario conectado |
| `pz_carrito` | Carrito: `[{ codigo, cantidad }]` |
| `pz_mensajes` | Mensajes de contacto |

## Reglas de validación

Todas se validan con JavaScript mientras el usuario escribe, con mensajes bajo cada campo.

| Formulario | Campo | Regla |
|---|---|---|
| Login | Correo | Requerido, máx. 100, solo @duoc.cl, @profesor.duoc.cl, @gmail.com |
| Login | Contraseña | Requerida, entre 4 y 10 caracteres |
| Contacto | Nombre | Requerido, máx. 100 |
| Contacto | Correo | Opcional, máx. 100, dominios permitidos |
| Contacto | Comentario | Requerido, máx. 500 |
| Producto | Código | Requerido, mín. 3, no se repite |
| Producto | Nombre | Requerido, máx. 100 |
| Producto | Descripción | Opcional, máx. 500 |
| Producto | Precio | Requerido, mín. 0 (0 = FREE), acepta decimales |
| Producto | Stock | Requerido, entero, mín. 0 |
| Producto | Stock crítico | Opcional, entero, mín. 0. Alerta si stock ≤ stock crítico |
| Producto | Categoría | Requerida (select) |
| Producto | Imagen | Opcional, máx. 300 KB |
| Usuario | RUN | Requerido, 7 a 9 caracteres, sin puntos ni guion, dígito verificador (módulo 11) |
| Usuario | Nombre | Requerido, máx. 50 |
| Usuario | Apellidos | Requerido, máx. 100 |
| Usuario | Correo | Requerido, máx. 100, dominios permitidos, no se repite |
| Usuario | Fecha de nacimiento | Opcional, no futura |
| Usuario | Tipo de usuario | Requerido (solo en admin): Administrador, Vendedor, Cliente |
| Usuario | Región / Comuna | Requeridas; la comuna cambia según la región |
| Usuario | Dirección | Requerida, máx. 300 |
| Registro | Contraseña | Requerida, 4 a 10, con confirmación |

> Nota: el RUN de ejemplo de la pauta (`19011022K`) no pasa el cálculo del módulo 11; su dígito verificador correcto es `2` (`190110222`).

## Reglas del carrito

- Se agrega desde Productos o desde el Detalle.
- Si el producto ya está, se suma la cantidad.
- No se puede superar el stock; los productos agotados no se pueden agregar.
- Cantidad mínima 1 (para quitarlo se usa Eliminar).
- Al pagar se crea una orden, se descuenta el stock y el carrito queda vacío.

## Roles

| Perfil | Acceso |
|---|---|
| Administrador | Todo el sistema |
| Vendedor | Productos (lista y detalle) y órdenes (lista y detalle). No ve Usuarios ni botones de crear, editar o eliminar |
| Cliente | Solo la tienda |

## Convención de commits

```
feat: nueva funcionalidad        (feat: carrito guarda en localStorage)
fix: corrección de error         (fix: comuna no se limpiaba al cambiar región)
style: cambios de CSS            (style: menú responsivo en celular)
docs: documentación              (docs: actualizar README y ERS)
```

Cada integrante trabaja en su propia rama (`feature/tienda`, `feature/formularios`, `feature/admin`) y la une a `main` con un Pull Request.
