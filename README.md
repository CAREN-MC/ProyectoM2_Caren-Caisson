# MiniBlog API

API REST para gestionar authors y posts, construida como base del servicio de contenidos MiniBlog de DevSpark. Permite crear, leer, actualizar y borrar authors y posts, con datos persistidos en PostgreSQL.

## Tecnologías

- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **Cliente de base de datos:** pg (node-postgres), con consultas SQL directas y parametrizadas
- **Variables de entorno:** dotenv
- **Tests:** Vitest + Supertest
- **Documentación:** OpenAPI 3.0 con Swagger UI
- **Deployment:** Railway

## Estructura del proyecto

```
miniblog-api/
├── src/
│   ├── app.js                  # Configuración de Express y rutas
│   ├── server.js               # Arranque del servidor
│   ├── db/pool.js              # Conexión a PostgreSQL (Pool de pg)
│   ├── middlewares/errorHandler.js
│   └── utils/createError.js
├── sql/
│   ├── setup.sql               # Crea las tablas authors y posts
│   └── seed.sql                # Datos de ejemplo
├── tests/
│   ├── authors.test.js
│   └── posts.test.js
├── openapi.yaml                # Documentación OpenAPI
├── .env.example                # Variables de entorno (sin credenciales)
└── package.json
```

## Requisitos

- [Node.js](https://nodejs.org/) y npm
- [PostgreSQL](https://www.postgresql.org/download/) (con `psql` o SQL Shell)
- Git

## Ejecutar en local

1. **Clonar el repositorio e instalar dependencias**

   ```bash
   git clone https://github.com/CAREN-MC/miniblog-api.git
   cd miniblog-api
   npm install
   ```

2. **Crear la base de datos** (en psql o SQL Shell):

   ```sql
   CREATE DATABASE miniblog;
   ```

3. **Ejecutar los scripts SQL** conectada a la base `miniblog`. Primero `setup.sql` y después `seed.sql`:

   ```bash
   psql -U postgres -d miniblog -f sql/setup.sql
   psql -U postgres -d miniblog -f sql/seed.sql
   ```

   Desde SQL Shell también se puede usar `\i` con la ruta del archivo, con barras `/`:

   ```sql
   \i 'C:/ruta/al/proyecto/sql/setup.sql'
   \i 'C:/ruta/al/proyecto/sql/seed.sql'
   ```

   `setup.sql` borra y vuelve a crear las tablas, así que sirve también para dejar la base como al principio.

4. **Configurar las variables de entorno.** Copiar `.env.example` como `.env` y completar con los datos reales:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña
   DB_NAME=miniblog
   ```

   El archivo `.env` está en `.gitignore` y no se sube a GitHub. Solo se versiona `.env.example`.

5. **Iniciar el servidor**

   ```bash
   npm start
   ```

   La API queda en `http://localhost:3000` (o en el puerto de la variable `PORT`, si está definida).

## Endpoints

### Autores

- `GET /authors` - Obtener todos los autores
- `GET /authors/:id` - Obtener un autor específico
- `POST /authors` - Crear un nuevo autor
- `PUT /authors/:id` - Actualizar un autor existente
- `DELETE /authors/:id` - Eliminar un autor (y sus posts)

### Posts

- `GET /posts` - Obtener todos los posts
- `GET /posts/:id` - Obtener un post específico
- `GET /posts/author/:authorId` - Obtener los posts de un autor, con el detalle del autor
- `POST /posts` - Crear un nuevo post
- `PUT /posts/:id` - Actualizar un post existente
- `DELETE /posts/:id` - Eliminar un post

### Validaciones y errores

- `name` y `email` son obligatorios para crear un author (400 si falta alguno).
- El `email` es único: si ya existe, responde 409.
- `title`, `content` y `author_id` son obligatorios para crear un post (400 si falta alguno).
- El `author_id` tiene que corresponder a un author existente (400 si no existe).
- `published` es opcional y vale `false` por defecto.
- Un `id` que no sea un entero positivo responde 400. Un id inexistente responde 404.
- Una ruta que no existe responde 404.
- Al eliminar un author se eliminan también sus posts (`ON DELETE CASCADE`).

## Ejemplos de uso

### Obtener todos los autores

```bash
curl http://localhost:3000/authors
```

**Respuesta (200):**

```json
[
  {
    "id": 1,
    "name": "Susana Cordisco",
    "email": "scord@gmail.com",
    "bio": "escritora de poesias, cuentos y microficciones",
    "created_at": "2026-11-11T17:16:58.370Z"
  },
  {
    "id": 2,
    "name": "Maria Palomeque",
    "email": "mpalomeque@gmail.com",
    "bio": "escritora de cuentos infantiles",
    "created_at": "2026-11-11T17:16:58.370Z"
  },
  {
    "id": 3,
    "name": "Jorge Pinto",
    "email": "jpinto@gmail.com",
    "bio": "escritor de ciencia ficción",
    "created_at": "2026-11-11T17:16:58.370Z"
  }
]
```

### Obtener un autor por id

```bash
curl http://localhost:3000/authors/1
```

**Respuesta (200):**

```json
{
  "id": 1,
  "name": "Susana Cordisco",
  "email": "scord@gmail.com",
  "bio": "escritora de poesias, cuentos y microficciones",
  "created_at": "2026-11-11T17:16:58.370Z"
}
```

### Crear un autor

```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "Laura Gómez", "email": "laura@gmail.com", "bio": "poeta"}'
```

**Respuesta (201):**

```json
{
  "id": 4,
  "name": "Laura Gómez",
  "email": "laura@gmail.com",
  "bio": "poeta",
  "created_at": "2026-11-19T22:00:00.000Z"
}
```

### Actualizar un autor

Solo se modifican los campos enviados.

```bash
curl -X PUT http://localhost:3000/authors/4 \
  -H "Content-Type: application/json" \
  -d '{"bio": "poeta y cuentista"}'
```

**Respuesta (200):**

```json
{
  "id": 4,
  "name": "Laura Gómez",
  "email": "laura@gmail.com",
  "bio": "poeta y cuentista",
  "created_at": "2026-11-19T22:00:00.000Z"
}
```

### Eliminar un autor

Al eliminar un autor se eliminan también sus posts.

```bash
curl -X DELETE http://localhost:3000/authors/4
```

**Respuesta:** `204 No Content` (sin cuerpo).

### Obtener los posts de un autor

La respuesta incluye el detalle del autor y la lista de sus posts.

```bash
curl http://localhost:3000/posts/author/1
```

**Respuesta (200):**

```json
{
  "author": {
    "id": 1,
    "name": "Susana Cordisco",
    "email": "scord@gmail.com",
    "bio": "escritora de poesias, cuentos y microficciones",
    "created_at": "2026-11-11T17:16:58.370Z"
  },
  "posts": [
    {
      "id": 1,
      "title": "Lluvia de marzo",
      "content": "Poema sobre las tardes de lluvia y los recuerdos que despiertan...",
      "author_id": 1,
      "published": true,
      "created_at": "2026-11-11T17:16:58.370Z"
    },
    {
      "id": 3,
      "title": "Microficción: el último tren",
      "content": "Un hombre espera un tren que nunca llega, hasta que...",
      "author_id": 1,
      "published": true,
      "created_at": "2026-11-11T17:16:58.370Z"
    },
    {
      "id": 5,
      "title": "Cuentos para antes de dormir",
      "content": "Borrador de una colección de cuentos cortos para leer en voz alta...",
      "author_id": 1,
      "published": false,
      "created_at": "2026-11-11T17:16:58.370Z"
    }
  ]
}
```

### Crear un post

`published` es opcional y vale `false` por defecto.

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primer post", "content": "Texto del post", "author_id": 1}'
```

**Respuesta (201):**

```json
{
  "id": 6,
  "title": "Mi primer post",
  "content": "Texto del post",
  "author_id": 1,
  "published": false,
  "created_at": "2026-11-19T22:00:00.000Z"
}
```

### Ejemplos de errores

**Autor inexistente (404):**

```bash
curl http://localhost:3000/authors/99
```

```json
{
  "error": "Author not found"
}
```

**Faltan datos obligatorios (400):**

```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "Sin email"}'
```

```json
{
  "error": "Name and email are required"
}
```

**Email duplicado (409):**

```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "Otra Susana", "email": "scord@gmail.com"}'
```

```json
{
  "error": "Email already exists"
}
```

## Tests

Los tests usan Vitest y Supertest, y se ejecutan con:

```bash
npm test
```

Requieren PostgreSQL en ejecución y el archivo `.env` configurado. Los tests se ejecutan contra la base indicada en `.env`, la misma que usa la API en local. Si la base queda con datos distintos a los del seed, se puede restaurar ejecutando de nuevo `setup.sql` y `seed.sql`.

## Documentación OpenAPI

La documentación completa de la API está disponible en Swagger UI:

- **Producción:** https://miniblog-api-production-d3f45b72.up.railway.app/api-docs
- **Local:** http://localhost:3000/api-docs

La especificación está en el archivo [`openapi.yaml`](./openapi.yaml). También se puede ver en [editor.swagger.io](https://editor.swagger.io) pegando el contenido del archivo, o en VS Code con una extensión de vista previa (por ejemplo Swagger Viewer).

Los `tags` del archivo (Authors y Posts) son opcionales: solo agrupan los endpoints en Swagger UI para que la documentación sea más fácil de leer.

## Deployment en Railway

1. **Subir el proyecto a GitHub** (sin `.env`).
2. **Crear un proyecto en Railway** y agregar un servicio de **PostgreSQL**.
3. **Crear las tablas y los datos en la base de Railway.** Activar el acceso público de la base (Settings > Networking > TCP Proxy), conectarse con `psql` o SQL Shell al host y puerto públicos, y ejecutar `setup.sql` y después `seed.sql`.
4. **Agregar un servicio desde el repositorio de GitHub** (+ Add > GitHub Repo). Railway instala las dependencias y arranca con `npm start`. El puerto lo asigna Railway mediante la variable `PORT`, que el servidor ya lee.
5. **Cargar las variables de entorno** en la pestaña Variables del servicio de la API, nunca en el repositorio. Se usan referencias a la base de Railway:

   | Variable | Valor |
   |---|---|
   | `DB_HOST` | `${{Postgres.PGHOST}}` |
   | `DB_PORT` | `${{Postgres.PGPORT}}` |
   | `DB_USER` | `${{Postgres.PGUSER}}` |
   | `DB_PASSWORD` | `${{Postgres.PGPASSWORD}}` |
   | `DB_NAME` | `${{Postgres.PGDATABASE}}` |

6. **Generar el dominio público** del servicio de la API (Settings > Networking > Generate Domain, puerto 8080) y probar `/authors` y `/api-docs` con esa URL.

Cada `git push` a la rama principal vuelve a desplegar la API automáticamente.

### URLs

| | URL |
|---|---|
| URL pública de la API | `https://miniblog-api-production-d3f45b72.up.railway.app` |
| URL interna de la base (usada por la API dentro de Railway) | `postgres.railway.internal:5432` |
| URL pública de la base (usada solo para ejecutar los scripts desde mi computadora) | `trolley.proxy.rlwy.net:57271` |

## Registro del uso de AI

Durante el proyecto usé **Claude** (Anthropic) como asistente de estudio y de revisión. Todo el código sugerido lo probé y lo revisé antes de incluirlo. Las fechas son aproximadas.

| Fecha | Tarea | Qué le pedí | Qué hice con la respuesta |
|---|---|---|---|
| 06/11 | Planificación | Le adjunté la consigna y le pedí una guía de trabajo con plazos hasta el 25/11. | Usé la guía como plan y checklist. Decidí usar `authors` como nombre de la entidad en lugar de `users`. |
| 06/11 | Entender el seed | Qué es un seed de SQL. | Entendí la diferencia entre `setup.sql` y `seed.sql`. |
| 11/11 | Base de datos | Cómo ejecutar los scripts en psql, cómo verificar las tablas y la clave foránea, y ayuda con errores de ruta y de comandos. | Corrí los scripts y comprobé las tablas, el borrado en cascada y la restricción de clave foránea. |
| 11/11 | Datos de ejemplo | Ideas para los posts de ejemplo del seed. | Elegí yo los autores. Adapté los textos propuestos para los posts y los cargué en `seed.sql`. |
| 11/11 | Git | Errores de repositorio (repositorio anidado, carpeta equivocada). | Corregí la carpeta de trabajo y los commits. |
| 11–13/11 | API con arrays | Orientación paso a paso para los endpoints de authors y posts, y revisión de mi código. | Escribí los endpoints de authors y la mayor parte de los de posts, y corregí los errores de sintaxis que me marcó. La IA propuso el código final de `POST /posts`, `PUT /posts/:id` y `GET /posts/author/:authorId`, que adapté y probé. |
| 12–13/11 | Pruebas manuales | Cómo usar Thunder Client y qué casos probar. | Probé los endpoints y corregí errores (URL incompleta, servidor sin reiniciar). |
| 13/11 | Plan de trabajo | Una planilla con las etapas y los plazos. | La usé para organizarme. |
| 14/11 | Conexión a PostgreSQL | Cómo configurar el `.env` y el `Pool` de `pg`. | Escribí `pool.js` y `.env`. La IA corrigió los nombres de las variables y sugirió que la contraseña no esté en el código. |
| 14–18/11 | Endpoints con SQL | Cómo pasar los endpoints de arrays a consultas SQL parametrizadas con `pg`. | Reescribí los endpoints con `pool.query` y probé cada uno con Thunder Client. |
| 14–18/11 | Validaciones, errores y tests | Cómo validar ids, manejar errores con un middleware y escribir tests con Vitest y Supertest. | Implementé `errorHandler`, `createError` y los 22 tests, y los corrí hasta que pasaron todos. |
| 19/11 | Soporte de `bio` | Por qué no se guardaba el campo `bio`. | Modifiqué `POST` y `PUT` de authors con las líneas sugeridas. |
| 19/11 | Documentación OpenAPI | Una propuesta de `openapi.yaml` con los 11 endpoints. | Escribí mi propio archivo, corregí mis errores de sintaxis y lo comparé con la propuesta. Los `tags` y la estructura base salieron de esa propuesta. |
| 19/11 | README | Un borrador del README y de este registro. | Lo revisé, corregí las tecnologías (`pg` es un cliente, no un ORM) y completé los datos reales. |
| 20/11 | Deployment en Railway | Los pasos para desplegar la API y la base en Railway. | Cargué las variables con referencias, generé el dominio y probé `/authors` y `/api-docs` en producción. |

### Criterio de uso

- La IA orientó y revisó, pero el código se probó con Thunder Client y con los tests antes de aceptarlo.
- Cuando no entendía una parte, pedí la explicación antes de incorporarla.
- Las credenciales reales nunca se incluyen en el repositorio: están solo en `.env`, que está en `.gitignore`.  