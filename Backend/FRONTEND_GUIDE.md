# Guía para el equipo de Frontend (Angular)

Esta guía explica cómo consumir la API de Gestión de Productos: qué endpoints existen, cuáles requieren token JWT, qué deben enviar y qué reciben de vuelta.

## 1. Cómo correr el backend

```bash
npm install
npm run start:dev
```

- La API corre en `http://localhost:3000`.
- Documentación interactiva (Swagger): **http://localhost:3000/api/docs** — ahí pueden probar cada endpoint, ver el cuerpo exacto de la petición/respuesta y autenticarse con el botón "Authorize" pegando el token.

## 2. Autenticación (JWT)

1. El usuario se registra (`POST /auth/register`) o inicia sesión (`POST /auth/login`).
2. La API responde con un `accessToken` (JWT).
3. Guarden ese token en el frontend (`localStorage`, por ejemplo) y envíenlo en **todas** las peticiones a rutas protegidas, en el header:

```
Authorization: Bearer <accessToken>
```

- El token expira en **1 día**. Si expira, la API responde `401 Unauthorized` y hay que mandar al usuario a iniciar sesión de nuevo.
- **Logout**: como el JWT es *stateless*, el servidor no "invalida" el token. `POST /auth/logout` solo confirma la acción; quien realmente cierra la sesión es el frontend, borrando el token guardado (y redirigiendo al login).

Ejemplo de interceptor de Angular para agregar el header automáticamente:

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

## 3. Formato de errores

Todas las respuestas de error siguen esta forma:

```json
{ "statusCode": 400, "message": "Descripción del error", "error": "Bad Request" }
```

En errores de validación, `message` es un **arreglo de strings** (uno por cada campo inválido):

```json
{ "statusCode": 400, "message": ["El correo no tiene un formato válido"], "error": "Bad Request" }
```

Códigos que van a ver seguido: `400` (datos inválidos), `401` (falta token o es inválido/expiró), `404` (no existe el recurso), `409` (nombre/correo duplicado).

## 4. Modelos de datos

### User
| Campo | Tipo | Notas |
|---|---|---|
| id | string (UUID) | |
| name | string | |
| email | string | único |
| createdAt | string (ISO date) | |

La contraseña nunca se devuelve en ninguna respuesta.

### Category
| Campo | Tipo | Notas |
|---|---|---|
| id | string (UUID) | |
| name | string | único (no distingue mayúsculas/minúsculas) |
| description | string \| null | |
| createdAt / updatedAt | string (ISO date) | |

### Product
| Campo | Tipo | Notas |
|---|---|---|
| id | string (UUID) | |
| name | string | único |
| description | string \| null | |
| price | number | precio, sin símbolos |
| stock | number | unidades disponibles |
| categoryId | string (UUID) | |
| category | Category | objeto completo de la categoría |
| images | ProductImage[] | ordenadas por `order` ascendente |
| createdAt / updatedAt | string (ISO date) | |

### ProductImage
| Campo | Tipo | Notas |
|---|---|---|
| id | string (UUID) | |
| url | string | URL de la imagen |
| order | number | posición en la galería (0 = primera) |

### Favorite (lo que devuelve `GET /favorites`)
Devuelve directamente un arreglo de **Product** (los productos favoritos del usuario autenticado), no un objeto intermedio.

## 5. Endpoints

Rutas **públicas** (no requieren token): pensadas para el Home, listado y detalle de producto/categoría, y búsqueda — cualquier visitante sin sesión puede verlas.
Rutas **protegidas** (requieren `Authorization: Bearer <token>`): crear/editar/borrar datos, perfil y favoritos.

### Autenticación — `/auth`
| Método | Ruta | JWT | Body | Respuesta |
|---|---|---|---|---|
| POST | `/auth/register` | No | `{ name: string, email: string, password: string (mín. 6) }` | `{ accessToken, user }` |
| POST | `/auth/login` | No | `{ email: string, password: string }` | `{ accessToken, user }` |
| POST | `/auth/logout` | Sí | — | `{ message }` |

### Perfil — `/users/me`
| Método | Ruta | JWT | Body | Respuesta |
|---|---|---|---|---|
| GET | `/users/me` | Sí | — | `User` |
| PATCH | `/users/me/password` | Sí | `{ currentPassword: string, newPassword: string (mín. 6, distinta a la actual) }` | `{ message }` |

### Categorías — `/categories`
| Método | Ruta | JWT | Body | Respuesta |
|---|---|---|---|---|
| GET | `/categories` | No | — | `Category[]` |
| GET | `/categories/:id` | No | — | `Category` |
| POST | `/categories` | Sí | `{ name: string, description?: string }` | `Category` (409 si el nombre ya existe) |
| PATCH | `/categories/:id` | Sí | `{ name?: string, description?: string }` | `Category` |
| DELETE | `/categories/:id` | Sí | — | `204 No Content` |

### Productos — `/products`
| Método | Ruta | JWT | Body / Query | Respuesta |
|---|---|---|---|---|
| GET | `/products` | No | Query opcional: `search`, `categoryId`, `page` (def. 1), `limit` (def. 10) | `{ data: Product[], total, page, limit, totalPages }` |
| GET | `/products/:id` | No | — | `Product` (para la pantalla de detalle) |
| POST | `/products` | Sí | `{ name, description?, price: number, stock: number, categoryId: string, images?: string[] }` | `Product` (409 si el nombre ya existe) |
| PATCH | `/products/:id` | Sí | Igual que crear, todos los campos opcionales | `Product` |
| DELETE | `/products/:id` | Sí | — | `204 No Content` |

**Home / barra de búsqueda:** usen `GET /products` para el listado inicial (home) y `GET /products?search=texto` para la búsqueda — filtra por nombre y descripción. Combínenlo con `categoryId` si además quieren filtrar por categoría, y con `page`/`limit` para paginar.

**Detalle de producto:** `GET /products/:id` trae todo lo necesario para la pantalla de detalle: precio, stock e imágenes (`images[].url`, ya ordenadas).

### Favoritos — `/favorites` (todas requieren JWT)
| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| GET | `/favorites` | — | `Product[]` — lo que se muestra al entrar a la sección Favoritos |
| POST | `/favorites/:productId` | — | El favorito creado (201). 409 si ya estaba en favoritos |
| DELETE | `/favorites/:productId` | — | `204 No Content`. 404 si no estaba en favoritos |

## 6. Resumen de pantallas sugeridas

| Pantalla | Endpoints que necesita |
|---|---|
| Login / Registro | `POST /auth/login`, `POST /auth/register` |
| Home (listado + búsqueda) | `GET /products`, `GET /categories` (para filtros) |
| Detalle de producto | `GET /products/:id`, `POST/DELETE /favorites/:productId` (botón de favorito) |
| Favoritos | `GET /favorites` |
| Perfil | `GET /users/me`, `PATCH /users/me/password` |
| Logout | `POST /auth/logout` + borrar token local |

Cualquier duda sobre el cuerpo exacto de una petición o respuesta, revisen Swagger en `/api/docs`, ahí está todo probado en vivo.
