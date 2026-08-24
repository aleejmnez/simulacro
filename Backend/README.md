# Gestión de Productos API

API REST construida con NestJS (arquitectura por capas), PostgreSQL/Supabase y TypeORM. Provee autenticación JWT, categorías, productos (con imágenes, precio y stock), búsqueda y favoritos — pensada como backend de práctica para el equipo de frontend en Angular.

## 1. Fork y configuración

```bash
npm install
cp .env.example .env
```

Edita `.env` con tus propios valores:

- `DATABASE_URL`: la cadena de conexión a **tu** base de datos PostgreSQL (por ejemplo, tu propio proyecto de Supabase). Si usas Supabase y tu red no tiene salida IPv6, usa el **Session pooler** (botón "Connect" en el dashboard → "Session pooler"), no la conexión directa.
- `JWT_SECRET`: cualquier string largo y aleatorio (puedes generarlo con `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`).

## 2. Crear las tablas (migración)

Este proyecto usa **migraciones de TypeORM**, no `synchronize`. La primera vez, contra tu base vacía, corre:

```bash
npm run migration:run
```

Esto crea todas las tablas (`users`, `categories`, `products`, `product_images`, `favorites`) con sus relaciones y restricciones. Solo hace falta correrlo una vez por base de datos.

Si más adelante cambias una entidad y necesitas generar una nueva migración:

```bash
npm run migration:generate src/migrations/NombreDelCambio
npm run migration:run
```

## 3. Correr el proyecto

```bash
npm run start:dev
```

- API: `http://localhost:3000`
- Documentación interactiva (Swagger): `http://localhost:3000/api/docs`

## 4. Otros comandos

```bash
npm run start        # modo normal, sin watch
npm run start:prod   # producción (requiere "npm run build" antes)
npm run test          # tests unitarios
npm run migration:revert  # deshace la última migración aplicada
```

## Documentación para frontend

Ver [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md): qué endpoint necesita JWT, qué body espera cada uno, qué devuelve y el formato de errores.
