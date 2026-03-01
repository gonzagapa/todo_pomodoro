<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

### Documentación de requerimientos (MVP) — API REST Focus To-Do: Pomodoro & Tareas

<aside>
🎯

**Objetivo:** construir una API REST (sin frontend) inspirada en _Focus To-Do: Pomodoro & Tareas_ para un MVP funcional y escalable, ideal para portafolio.

**Fuera de alcance (por ahora):** estadísticas, calendario, reportes, gamificación, sincronización multi-plataforma, whitelist de apps, sonidos, etc.

</aside>

#### 1) Alcance funcional

- **Usuarios**
  - Registro e inicio de sesión.
  - Gestión de perfil básico.
  - Control de acceso (endpoints protegidos).
- **Tareas**
  - CRUD de tareas.
  - Campos mínimos para soportar estimación de pomodoros y estado.
  - Subtareas simples (opcional en MVP, pero contemplado en el diseño).
- **Pomodoro**
  - Configuración de temporizador por usuario (duración foco, descanso corto, descanso largo, ciclos).
  - Sesiones de enfoque asociadas a una tarea.
  - Flujo: iniciar, pausar, reanudar, finalizar, cancelar.
  - Persistencia de sesiones para auditoría básica (no estadísticas).

#### 2) Usuarios objetivo (personas)

- Persona 1: alguien que quiere registrar tareas y ejecutar sesiones de pomodoro.
- Persona 2: reclutador o entrevistador que revisará arquitectura, buenas prácticas, documentación y pruebas.

#### 3) Requerimientos no funcionales

- **Arquitectura:** NestJS modular, principios SOLID, separación por capas (controller, service, repository).
- **Persistencia:** PostgreSQL (recomendado) con ORM (Prisma o TypeORM).
- **Versionado de API:** prefijo `/api/v1`.
- **Validación:** `class-validator` + `class-transformer`.
- **Errores:** manejo global con filtros de excepción y formato consistente.
- **Seguridad:** hash de contraseñas (bcrypt/argon2), JWT, rate limiting, CORS.
- **Observabilidad:** logging estructurado (pino o winston), request id.
- **Documentación:** OpenAPI (Swagger) y README de ejecución local.
- **Testing:** unitario + integración (mínimo) y cobertura objetivo.
- **CI (deseable para portafolio):** lint, tests, build en GitHub Actions.

#### 4) Modelo de dominio (entidades)

- **User**
  - `id` (UUID)
  - `email` (único)
  - `passwordHash`
  - `name` (opcional)
  - `createdAt`, `updatedAt`
- **Task**
  - `id` (UUID)
  - `userId` (FK)
  - `title`
  - `notes` (opcional)
  - `status` (por ejemplo: `pending`, `in_progress`, `done`, `archived`)
  - `priority` (opcional: 1–4)
  - `estimatedPomodoros` (opcional)
  - `dueAt` (opcional)
  - `createdAt`, `updatedAt`
- **PomodoroSettings** (1:1 con User)
  - `userId` (PK / FK)
  - `focusMinutes` (default 25)
  - `shortBreakMinutes` (default 5)
  - `longBreakMinutes` (default 15)
  - `longBreakEvery` (default 4)
- **PomodoroSession**
  - `id` (UUID)
  - `userId` (FK)
  - `taskId` (FK, nullable si se permite sesión sin tarea)
  - `type` (`focus`, `short_break`, `long_break`)
  - `status` (`running`, `paused`, `completed`, `canceled`)
  - `startedAt`, `endedAt` (nullable)
  - `durationSeconds` (calculado o guardado)
  - `createdAt`

#### 5) API: endpoints propuestos (MVP)

<aside>
🧩

Todas las rutas asumen autenticación por **Bearer JWT**, excepto `auth/*`.

</aside>

- **Auth**
  - `POST /api/v1/auth/register`
    - Crea usuario.
  - `POST /api/v1/auth/login`
    - Retorna `accessToken`.
  - `POST /api/v1/auth/refresh` (opcional)
    - Si implementas refresh tokens.
  - `POST /api/v1/auth/logout` (opcional)
- **Users**
  - `GET /api/v1/users/me`
  - `PATCH /api/v1/users/me`
- **Tasks**
  - `POST /api/v1/tasks`
  - `GET /api/v1/tasks` (filtros: `status`, `q`, `page`, `pageSize`)
  - `GET /api/v1/tasks/:id`
  - `PATCH /api/v1/tasks/:id`
  - `DELETE /api/v1/tasks/:id` (soft delete recomendado)
- **Pomodoro settings**
  - `GET /api/v1/pomodoro/settings`
  - `PUT /api/v1/pomodoro/settings`
- **Pomodoro sessions**
  - `POST /api/v1/pomodoro/sessions`
    - Crea e inicia una sesión `focus` asociada a `taskId`.
  - `PATCH /api/v1/pomodoro/sessions/:id/pause`
  - `PATCH /api/v1/pomodoro/sessions/:id/resume`
  - `PATCH /api/v1/pomodoro/sessions/:id/complete`
  - `PATCH /api/v1/pomodoro/sessions/:id/cancel`
  - `GET /api/v1/pomodoro/sessions` (paginado; para historial básico)

#### 6) Contratos (DTOs) y reglas de negocio

- **Registro**
  - `email` válido, único.
  - Contraseña con mínimo de longitud.
- **Tareas**
  - `title` requerido.
  - Solo el propietario puede leer o modificar.
  - `status` controlado por enum.
- **Sesiones**
  - Solo una sesión `running` por usuario (regla recomendada).
  - `pause/resume` solo aplican si el estado lo permite.
  - Al completar una sesión `focus`, opcionalmente actualizar `Task.status` a `in_progress` o dejarlo manual.

#### 7) Seguridad y autorización

- JWT con expiración corta.
- (Opcional) refresh tokens almacenados de forma segura.
- Rate limiting para endpoints de auth.
- Sanitización y validación de entrada.
- Headers de seguridad básicos (helmet).

#### 8) Documentación y entregables de portafolio

- `README.md` con:
  - stack, setup local, variables de entorno.
  - scripts (`lint`, `test`, `test:e2e`, `migration`, `seed`).
  - decisiones técnicas (por qué Prisma/TypeORM, por qué JWT, etc.).
- Swagger en `/api/docs`.
- Colección de Postman o archivo `openapi.json` exportable.
- Diagrama simple de arquitectura (opcional).

#### 9) Testing (mínimo viable pero serio)

- Unit tests:
  - services de `Tasks` y `PomodoroSessions`.
  - validación de reglas de negocio.
- Integration / e2e:
  - `auth/register` + `auth/login`.
  - flujo básico: crear tarea → iniciar sesión pomodoro → completar.
- Datos:
  - usar una BD de pruebas en Docker o sqlite temporal (según ORM).

#### 10) Plan de 4 meses (solo fines de semana) + estudio entre semana

<aside>
🗓️

**Supuesto:** 16 semanas. Sábados y domingos para construcción. Entre semana para estudio y preparación.

</aside>

- **Mes 1 (Semanas 1–4): Base técnica y cimientos del proyecto**
  - Fines de semana:
    - Bootstrap NestJS (config, módulos, env, lint, prettier).
    - Conexión a DB + migraciones.
    - Módulo `health` y manejo global de errores.
    - Swagger inicial.
  - Entre semana (estudio):
    - NestJS fundamentals (modules, controllers, providers, DI).
    - HTTP, REST, códigos de estado.
    - PostgreSQL básico + migraciones.
- **Mes 2 (Semanas 5–8): Autenticación y usuarios**
  - Fines de semana:
    - Registro/login con JWT.
    - Guards y decorators (por ejemplo `@CurrentUser`).
    - `users/me`.
    - Hardening: rate limit, helmet, CORS.
  - Entre semana (estudio):
    - JWT y amenazas comunes.
    - hashing de contraseñas.
    - validación con pipes.
- **Mes 3 (Semanas 9–12): Tareas (MVP) + calidad**
  - Fines de semana:
    - CRUD de tareas con filtros y paginación.
    - Soft delete.
    - Tests unitarios de `TasksService`.
  - Entre semana (estudio):
    - Testing en NestJS (mocks, providers).
    - Diseño de APIs (DTOs, versionado).
- **Mes 4 (Semanas 13–16): Pomodoro (sesiones) + e2e + pulido de portafolio**
  - Fines de semana:
    - Settings de pomodoro.
    - Sesiones: start/pause/resume/complete/cancel.
    - Reglas (una sesión running por usuario).
    - Tests e2e del flujo principal.
    - CI con GitHub Actions.
    - Pulir README, Swagger, seeds.
  - Entre semana (estudio):
    - e2e con supertest.
    - Docker básico para levantar Postgres.
    - logging y manejo de errores.

#### 11) Lecturas recomendadas (para profundizar)

- **NestJS**
  - Documentación oficial de NestJS (fundamentals, security, testing).
- **Diseño de APIs**
  - _API Design Patterns_ (JJ Geewax).
  - _REST API Design Rulebook_ (Mark Masse).
- **Arquitectura y buenas prácticas**
  - _Clean Architecture_ (Robert C. Martin).
  - _Clean Code_ (Robert C. Martin) — enfocado en prácticas.
- **Seguridad**
  - OWASP API Security Top 10.
- **Testing**
  - Testing NestJS (docs) + SuperTest.
- **SQL / PostgreSQL**
  - _The Art of PostgreSQL_ (Dimitri Fontaine) o guías introductorias.
