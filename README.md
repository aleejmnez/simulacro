# Simulacro prueba de desempeño — Frontend en React + TypeScript

## Se evaluará puntualmente

1. **Arquitectura del proyecto:** organización por carpetas y modularización con ES Modules (separación de capas: componentes, hooks, servicios/API, tipos).
2. **Sistema de tipos:** tipado estático consistente, interfaces y tipos avanzados (utility types, uniones, tipos condicionales según el caso).
3. **Genéricos:** aplicados a funciones o hooks reutilizables (ej. una capa de fetch tipada).
4. **Clases y objetos:** únicamente donde el problema lo amerite (no como requisito forzado).
5. **Capa de comunicación con la API:** `fetch` o Axios, con interceptores de request/response para inyectar el token y reaccionar a respuestas `401`.
6. **Manejo estructurado de excepciones:** `try/catch/finally` diferenciando error de red, de validación y de autorización.
7. **Persistencia de sesión:** `localStorage` y `sessionStorage`, con criterio justificado sobre cuál usar.
8. **Enrutamiento protegido:** rutas restringidas por autenticación y por autorización basada en rol (RBAC).
9. **Composición de componentes:** props, estado local (`useState`) y efectos de sincronización con el backend (`useEffect`).
10. **Gestión de estado global:** Context API.
11. **Formularios controlados:** captura, validación y manejo de errores del servidor en el formulario.
12. **Renderizado declarativo:** JSX, renderizado condicional y listas dinámicas.
13. **Manejo de errores de renderizado:** Error Boundaries.
14. **Pruebas:** unitarias y de integración (Jest / React Testing Library).

*(No se evalúan decoradores de TypeScript ni namespaces — no aplican en el ecosistema actual de React; ver la sección "Qué no se evalúa" más abajo para el detalle completo.)*

## Contexto

Vas a construir el frontend de una aplicación de gestión de productos que consume una API REST ya construida y funcionando (NestJS + PostgreSQL). El backend maneja usuarios con roles, categorías, productos y favoritos, con autenticación por JWT. Tu trabajo es construir la interfaz que consuma correctamente esa API, respetando las reglas de negocio que ya existen en el servidor (roles, validaciones, errores).

No estás construyendo desde cero un problema abstracto: estás integrando un frontend contra un backend real, con sus mismas reglas y sus mismos errores. Si algo falla porque no manejaste un caso, la API te lo va a decir — se espera que sepas leer esa respuesta y reaccionar a ella.

## Duración y modalidad

- **Duración:** 8 horas, individual.
- Puedes consultar documentación oficial (MDN, React, TypeScript, Axios, React Router, etc.) libremente durante la prueba.
- Se evalúa el manejo correcto de los temas, no la cantidad de pantallas. Un flujo pequeño bien resuelto (tipado correcto, errores manejados, roles respetados) vale más que muchas vistas con huecos.

## Stack y herramientas

- **React + TypeScript** (Vite recomendado, pero es tu decisión).
- **Ruteo:** React Router u otra librería equivalente, a tu criterio.
- **HTTP:** `fetch` o Axios — decide cuál usar y justifícalo brevemente en el README (por qué esa elección, cómo resolviste los interceptores en el caso de `fetch`).
- **Testing:** Jest + React Testing Library (o Vitest si usas Vite).
- **Estilos:** libres. El diseño visual se evalúa; pero tiene más peso la funcionalidad y el código limpio.

## Backend: puesta en marcha

Cada uno corre su propia instancia de la API contra su propia base de datos en Supabase — así puedes seguir trabajando desde cualquier lugar sin depender de un servidor compartido.

1. Clona el repositorio del backend. **Link**: https://github.com/carlosdcastano/gestion-de-productos
2. Instala las dependencias: `npm install`.
3. Crea tu `.env` a partir de `.env.example` y complétalo con tu propio `DATABASE_URL`:
   - En Supabase: **Abren su proyecto → Connect → Direct Connection string → Session pooler →  bajan un poco y verán un string con la conexión a la base de datos, lo copian y lo pegan en lugar del ejemplo en el .env con la contraseña correcta del proyecto de supabase**
   - Genera también un valor propio para `JWT_SECRET` (cualquier string aleatorio largo).
4. Corre las migraciones: `npm run migration:run`. Esto crea el esquema completo **y** siembra automáticamente el usuario admin (no necesitas crearlo a mano).
5. Levanta el servidor: `npm run start:dev`.
6. Verifica que quedó arriba entrando a `http://localhost:3000/api/docs` (Swagger).

**Una vez levantado:**

- **Base URL:** `http://localhost:3000`
- **Documentación interactiva (Swagger):** `http://localhost:3000/api/docs`
- **Cuenta admin ya sembrada por la migración:**
  - Email: `admin@examen.com`
  - Password: `Admin123!`
- Para probar el flujo de usuario regular (No admin), registra tu propia cuenta desde `/auth/register`.

## Qué no se evalúa

- Decoradores de TypeScript — no se usan en el ecosistema actual de React, no los necesitas aquí.
- Subida real de archivos: las imágenes de producto son URLs, no hay `multipart/form-data`.

## Entregable

Repositorio con el proyecto completo, más un `README.md` que explique:
- Cómo correr el proyecto localmente.
- Dónde guardaste el token de sesión (`localStorage` vs `sessionStorage`) y por qué elegiste esa opción.
- Qué librería usaste para las peticiones HTTP y cómo resolviste el interceptor de autenticación.

---

## Módulo 1 — Tipado del dominio

**Objetivo:** modelar correctamente, en TypeScript, los datos que entrega el backend, y manejar con criterio los errores que puede devolver.

**Debes implementar:**

- Interfaces o types para `Product`, `Category`, `User` y la respuesta de autenticación (`{ accessToken, user }`).
- Un type para la respuesta paginada de productos: `{ data, total, page, limit, totalPages }`.
- Al menos un genérico reutilizable — por ejemplo, un hook `useFetch<T>` o una función `request<T>(url: string): Promise<T>` que tipe la respuesta según lo que le pidas. Si lo resuelves con un hook, dispara la petición desde un `useEffect` (no en el cuerpo del componente ni en un evento suelto), y controla su dependencia correctamente para no generar peticiones infinitas.
- Una clase u objeto con lógica propia **solo si el caso realmente lo justifica** (por ejemplo, una clase de error personalizada que distinga error de red vs. error de la API). No la fuerces si no aporta nada.
- `try/catch/finally` en toda llamada a la API, distinguiendo al menos tres casos: error de red (backend caído), error de validación (`400`), y no autorizado/prohibido (`401`/`403`).

**Criterios de aceptación:**

- [ ] No hay ningún `any` sin justificar en el código.
- [ ] Los tipos de las respuestas del backend están definidos y se reutilizan de forma consistente (no repites la misma forma de objeto a mano en cinco archivos).
- [ ] Si el backend está caído o no responde, la app no se rompe: el usuario ve un mensaje, no una pantalla en blanco.

---

## Módulo 2 — Autenticación, sesión y control de acceso por rol

**Objetivo:** implementar el flujo de sesión completo contra la API y condicionar la interfaz según el rol del usuario autenticado.

**Debes implementar:**

- Formularios controlados de registro e inicio de sesión, mostrando al usuario los errores de validación que devuelve la API (`400`, `401`, `409`) — no solo en consola.
- Persistencia del `accessToken` en `localStorage` o `sessionStorage`.
- Un interceptor de Axios (o un wrapper equivalente sobre `fetch`) que adjunte automáticamente `Authorization: Bearer <token>` en toda petición a rutas protegidas, y que reaccione si la API responde `401` (por ejemplo, cerrando la sesión localmente).
- Un `AuthContext` que exponga el usuario autenticado, su `role`, y las funciones `login` / `logout`.
- Protección de rutas en dos niveles:
  - **Autenticado vs. no autenticado** (ej. favoritos, crear producto).
  - **Por rol** — el formulario de creación de categorías solo debe ser accesible para `role: "admin"`. Un usuario `user` que intente entrar por URL directa debe ser redirigido, no solo no ver el botón.

**Endpoints disponibles:**

| Método | Ruta | Auth | Rol |
|---|---|---|---|
| `POST` | `/auth/register` | No | — |
| `POST` | `/auth/login` | No | — |
| `POST` | `/auth/logout` | Sí | cualquiera |
| `GET` | `/users/me` | Sí | cualquiera |

**Criterios de aceptación:**

- [ ] Sin token, ninguna ruta protegida es accesible, ni por navegación ni por URL directa.
- [ ] Un usuario `user` que intenta crear una categoría recibe feedback claro de que no tiene permisos (no un error genérico ni un fallo silencioso).
- [ ] Al recargar la página, la sesión persiste mientras el token siga vigente.
- [ ] Al cerrar sesión, se limpia el storage y se llama `POST /auth/logout`.

---

## Módulo 3 — Categorías

**Objetivo:** listar categorías públicamente y restringir su creación a administradores.

**Debes implementar:**

- Listado público de categorías (visible sin login). Esta no cuenta con paginación desde la API.
- Vista de detalle de una categoría, mostrando sus productos, con un botón "Agregar producto a esta categoría" visible solo para usuarios autenticados (cualquier rol).
- Formulario de creación de categoría, accesible únicamente para `admin`.

**Endpoints disponibles:**

| Método | Ruta | Auth | Rol |
|---|---|---|---|
| `GET` | `/categories` | No | — |
| `GET` | `/categories/:id` | No | — |
| `POST` | `/categories` | Sí | `admin` |
| `PATCH` | `/categories/:id` | Sí | `admin` |
| `DELETE` | `/categories/:id` | Sí | `admin` |

**Criterios de aceptación:**

- [ ] Un usuario no-admin no puede llegar al formulario de crear categoría, ni navegando ni escribiendo la URL.
- [ ] Las categorías se listan correctamente y permiten navegar a sus productos.

---

## Módulo 4 — Productos

**Objetivo:** CRUD de productos, con dos formas distintas de llegar a "crear producto", pero un solo formulario detrás.

**Debes implementar:**

- Listado de productos con paginación, búsqueda y filtro por categoría, usando los query params que ya expone la API (`search`, `categoryId`, `page`, `limit`).
- Vista de detalle de producto.
- Un formulario de creación de producto **reutilizado** en dos entradas distintas:
  - Desde la vista de una categoría: el `categoryId` ya viene definido por el contexto (no necesitas mostrarle el desplegable al usuario, o puedes mostrarlo precargado y deshabilitado).
  - Desde la zona general de productos: aquí sí necesitas un `<select>` con todas las categorías existentes (`GET /categories`) para que el usuario elija.
- Edición y eliminación de producto (requiere estar autenticado).
- Campo de imágenes como input de texto para URLs — no hay subida de archivos.

> **Nota sobre las imágenes:** si vas a probar con una URL de Google Imágenes, usa clic derecho → **"Copiar dirección de la imagen"** (el link directo al archivo). Si copias la URL de la página de resultados de Google, el `<img>` no va a cargar — y eso no es un bug de tu código, es que esa URL no apunta a una imagen.

**Endpoints disponibles:**

| Método | Ruta | Auth | Rol |
|---|---|---|---|
| `GET` | `/products` | No | — |
| `GET` | `/products/:id` | No | — |
| `POST` | `/products` | Sí | cualquiera |
| `PATCH` | `/products/:id` | Sí | cualquiera |
| `DELETE` | `/products/:id` | Sí | cualquiera |

**Criterios de aceptación:**

- [ ] El formulario de creación es el mismo componente reutilizado en ambas entradas — no hay dos formularios distintos.
- [ ] Hay renderizado condicional de estados: cargando, lista vacía, error de carga.
- [ ] Una URL de imagen inválida o rota no rompe el layout de la página.

---

## Módulo 5 — Favoritos

**Objetivo:** manejar una relación simple usuario-producto con sus casos de error.

**Debes implementar:**

- Un ícono/botón de favorito en cada producto, visible solo para usuarios autenticados.
- Una vista "Mis favoritos" que liste los productos guardados por el usuario actual.
- Manejo correcto de `409` (ya estaba en favoritos) y `404` (no estaba) sin que la interfaz se rompa.

**Criterios de aceptación:**

- [ ] El estado del ícono de favorito refleja si el producto ya está guardado o no.
- [ ] Agregar o quitar un favorito actualiza la lista sin necesidad de recargar la página.

---

## Módulo 6 — Manejo de errores en la interfaz

**Objetivo:** que un fallo — de red o de renderizado — nunca deje al usuario ante una pantalla en blanco.

**Debes implementar:**

- Consistencia global del `try/catch/finally` que ya usaste en los módulos anteriores: toda petición fallida debe traducirse en un mensaje visible para el usuario.
- Un **Error Boundary** simple que envuelva la aplicación (o al menos las secciones que muestran datos), capture errores de renderizado y muestre un mensaje amigable con opción de recargar. No necesita ser sofisticado: capturar el error y mostrar un fallback es suficiente.

**Criterios de aceptación:**

- [ ] Si una llamada a la API falla, el usuario ve feedback claro, no solo un error en consola.
- [ ] El Error Boundary captura al menos un caso real de fallo de renderizado (puedes forzarlo intencionalmente para demostrarlo).

---

## Módulo 7 — Pruebas

**Objetivo:** demostrar que sabes escribir pruebas básicas — no se espera cobertura completa.

**Debes implementar, como mínimo:**

- Una prueba unitaria de una función o componente puro (ej. una función que formatea el precio, o un componente que renderiza texto según props).
- Una prueba de integración con React Testing Library que simule una interacción real (ej. completar y enviar el formulario de login) y verifique el resultado.

**Criterios de aceptación:**

- [ ] Las pruebas corren con un solo comando y pasan.
- [ ] No mockeaste toda la aplicación — con simular la llamada a la API es suficiente.

---

## Evaluación general

- Se prioriza la correctitud del manejo de tipos, roles y errores sobre la cantidad de funcionalidades.

- Puedes consultar documentación oficial libremente. Lo que se evalúa es tu criterio al aplicarla, no que la memorices.