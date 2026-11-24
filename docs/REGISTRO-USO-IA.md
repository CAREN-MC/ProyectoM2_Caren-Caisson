Registro por fecha
06/11 — Planificación
Qué le pedí: una guía de trabajo con plazos hasta el 25/11, adjuntando la consigna.
Qué hice: la usé como plan y checklist. Decidí usar authors como nombre de la entidad en lugar de users.
06/11 — Entender el seed
Qué le pedí: qué es un seed de SQL.
Qué hice: entendí la diferencia entre setup.sql y seed.sql.
11/11 — Base de datos
Qué le pedí: cómo ejecutar los scripts en psql, verificar las tablas y la clave foránea, y ayuda con errores de ruta y de comandos.
Qué hice: corrí los scripts y comprobé las tablas, el borrado en cascada y la restricción de clave foránea.
11/11 — Datos de ejemplo
Qué le pedí: ideas para los posts de ejemplo del seed.
Qué hice: elegí yo los autores, adapté los textos propuestos y los cargué en seed.sql.
11/11 — Git
Qué le pedí: ayuda con errores de repositorio (repositorio anidado, carpeta equivocada).
Qué hice: corregí la carpeta de trabajo y los commits.
11–13/11 — API con arrays
Qué le pedí: orientación paso a paso para los endpoints de authors y posts, y revisión de mi código.
Qué hice: escribí los endpoints de authors y la mayor parte de los de posts, y corregí los errores de sintaxis que me marcó. La IA propuso el código final de POST /posts, PUT /posts/:id y GET /posts/author/:authorId, que adapté y probé.
12–13/11 — Pruebas manuales
Qué le pedí: cómo usar Thunder Client y qué casos probar.
Qué hice: probé los endpoints y corregí errores (URL incompleta, servidor sin reiniciar).
13/11 — Plan de trabajo
Qué le pedí: una planilla con las etapas y los plazos.
Qué hice: la usé para organizarme.
14/11 — Conexión a PostgreSQL
Qué le pedí: cómo configurar el .env y el Pool de pg.
Qué hice: escribí pool.js y .env. La IA corrigió los nombres de las variables y sugirió que la contraseña no esté en el código.
14–18/11 — Endpoints con SQL
Qué le pedí: cómo pasar los endpoints de arrays a consultas SQL parametrizadas con pg.
Qué hice: reescribí los endpoints con pool.query y probé cada uno con Thunder Client.
14–18/11 — Validaciones, errores y tests
Qué le pedí: cómo validar ids, manejar errores con un middleware y escribir tests con Vitest y Supertest.
Qué hice: implementé errorHandler, createError y los tests, y los corrí hasta que pasaron todos.
19/11 — Soporte de bio
Qué le pedí: por qué no se guardaba el campo bio.
Qué hice: modifiqué POST y PUT de authors con las líneas sugeridas.
19/11 — Documentación OpenAPI
Qué le pedí: una propuesta de openapi.yaml con los 11 endpoints.
Qué hice: escribí mi propio archivo, corregí mis errores de sintaxis y lo comparé con la propuesta. Los tags y la estructura base salieron de esa propuesta.
19/11 — README
Qué le pedí: un borrador del README y de este registro.
Qué hice: lo revisé, corregí las tecnologías (pg es un cliente, no un ORM) y completé los datos reales.
20/11 — Deployment en Railway
Qué le pedí: los pasos para desplegar la API y la base en Railway.
Qué hice: cargué las variables con referencias, generé el dominio y probé /authors y /api-docs en producción.
22/11 — Validación del nombre en PUT /authors/:id
Qué le pedí: cómo probar que el nombre vacío se rechace.
Qué hice: probé los casos en Thunder Client, vi que el PUT aceptaba un nombre vacío sin avisar, y agregué la validación que devuelve 400.
23/11 — Revisión final y apunte de estudio
Qué le pedí: una revisión de todo el proyecto contra la consigna y un resumen ordenado de principio a fin.
Qué hice: revisé el checklist (repositorio, .env, tests, producción), comprobé que no hubiera claves en el historial de git y usé el resumen para estudiar.


Criterio de uso
La IA orientó y revisó, pero el código se probó con Thunder Client y con los tests antes de aceptarlo.
Cuando no entendía una parte, pedí la explicación antes de incorporarla.
Las credenciales reales nunca se incluyen en el repositorio: están solo en .env, que está en .gitignore.