# Forma & Fusión — Sitio web

Sitio corporativo y panel de administración de **Forma & Fusión**, estudio de
diseño y construcción con sede en Ecuador.

**En producción:** https://forma-fusion-web-production.up.railway.app
· **Panel:** [/admin](https://forma-fusion-web-production.up.railway.app/admin)

El lenguaje visual está calcado del de [big.dk](https://big.dk): blanco y negro
puros, una grotesca neutra, retícula de cuatro columnas, líneas de 1px en lugar
de cajas y movimiento continuo (scroll con inercia, revelados por scroll,
parallax en portada).

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15.5 (App Router, React 19, TypeScript) |
| Estilos | Tailwind CSS v4 |
| Animación | Motion (Framer Motion) + Lenis |
| Base de datos | PostgreSQL + Prisma |
| Autenticación | JWT propio (`jose`) en cookie httpOnly + bcrypt |
| Validación | Zod |
| Despliegue | Railway (Nixpacks) |

## Arquitectura

El código sigue una arquitectura limpia: las dependencias apuntan siempre hacia
adentro. El dominio no sabe que existen Prisma ni Next.js.

```
src/
├── domain/                 # Núcleo: no importa nada externo
│   ├── entities/           #   Project, Category, NewsPost, TeamMember…
│   ├── repositories/       #   Puertos (interfaces) de persistencia
│   └── value-objects/      #   slug
│
├── application/            # Casos de uso; reciben los repositorios por parámetro
│   ├── use-cases/          #   listPublishedProjects, createProject…
│   └── dto/                #   Esquemas Zod de entrada
│
├── infrastructure/         # Detalles reemplazables
│   ├── persistence/prisma/ #   Implementación de los puertos + mappers
│   ├── auth/               #   Sesión, hashing, guardas
│   └── config/container.ts #   Composición de dependencias (único punto de unión)
│
├── presentation/           # Componentes React
│   └── components/{layout,ui,home,project,admin}
│
└── app/                    # Rutas Next.js (controladores finos)
    ├── (site)/             #   Sitio público
    ├── admin/              #   Panel de administración
    └── api/health/         #   Health check para Railway
```

**Por qué así.** Cambiar Prisma por otro ORM solo obliga a reescribir
`infrastructure/persistence` y una línea de `container.ts`. Los casos de uso son
funciones puras respecto a la infraestructura: se prueban pasándoles dobles de
los repositorios, sin levantar una base de datos.

---

## Puesta en marcha local

Requisitos: Node 20+ y una base PostgreSQL.

```bash
npm install
cp .env.example .env          # y edita DATABASE_URL y AUTH_SECRET
npx prisma migrate deploy     # crea el esquema
npm run db:seed               # datos de demostración
npm run dev                   # http://localhost:3000
```

Genera un `AUTH_SECRET` real con:

```bash
openssl rand -base64 32
```

### Acceso al panel

`http://localhost:3000/admin` — credenciales por defecto del seed en local:

```
Correo:      admin@formafusion.ec
Contraseña:  FormaFusion2026!
```

> Estas son solo para desarrollo local. **En producción la contraseña es otra**,
> generada al desplegar y guardada en la variable `ADMIN_PASSWORD` del servicio
> de Railway (`railway variables --service forma-fusion-web`). Para cambiarla,
> actualiza la variable y borra el usuario para que el seed lo vuelva a crear.

---

## Panel de administración

Vive dentro de la misma aplicación, en `/admin`, protegido por middleware. Un
solo servicio y un solo despliegue en lugar de dos aplicaciones separadas.

| Sección | Qué permite |
|---|---|
| **Resumen** | Contadores de contenido, últimos proyectos y mensajes |
| **Proyectos** | CRUD completo: ficha técnica, galería, portada, destacado, borrador/publicado |
| **Categorías** | Alimentan el mega-menú y los filtros del sitio, con jerarquía padre/hijo |
| **Noticias** | Editor de publicaciones con borrador y fecha automática al publicar |
| **Equipo** | Miembros del estudio mostrados en la página *Estudio* |
| **Oficinas** | Direcciones del pie de página y de *Contacto* |
| **Mensajes** | Bandeja del formulario de contacto, con marcado de leído |
| **Ajustes** | Correo, teléfono, Instagram, WhatsApp y lema del pie |

Las imágenes se gestionan por URL (Unsplash, Cloudinary o cualquier CDN). No hay
subida de archivos: en Railway el sistema de ficheros es efímero y un fichero
subido desaparecería en el siguiente despliegue.

---

## Despliegue en Railway

> Ya está desplegado. El servicio está conectado a este repositorio: **cada push
> a `main` dispara un despliegue automático**. Las variables de entorno y la
> contraseña del panel están configuradas en el servicio de Railway.

Los pasos siguientes documentan cómo se montó, por si hay que rehacerlo:

1. **Crear el proyecto** desde el repositorio de GitHub
   (`New Project → Deploy from GitHub repo`).

2. **Añadir PostgreSQL** al proyecto (`New → Database → Add PostgreSQL`).
   Railway crea `DATABASE_URL` automáticamente.

3. **Configurar las variables** del servicio web:

   | Variable | Valor |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (referencia al servicio) |
   | `AUTH_SECRET` | resultado de `openssl rand -base64 32` |
   | `ADMIN_EMAIL` | correo del administrador |
   | `ADMIN_PASSWORD` | contraseña inicial |
   | `NEXT_PUBLIC_SITE_URL` | dominio público, p. ej. `https://formafusion.up.railway.app` |

4. **Desplegar.** `nixpacks.toml` y `railway.json` ya definen el proceso: Railway
   instala, compila, aplica las migraciones (`prisma migrate deploy`) y arranca.
   El health check apunta a `/api/health`, que además comprueba la conexión a
   Postgres.

5. **Los datos se siembran solos.** El comando de arranque ejecuta
   `prisma migrate deploy` y luego el seed. El seed asegura el usuario
   administrador y, si la base **ya tiene proyectos**, no toca nada más: el
   contenido editado desde `/admin` nunca se sobrescribe en un redespliegue.

`PORT` lo inyecta Railway y `next start` lo respeta. El dominio del servicio
apunta a ese mismo puerto (8080); si se cambia, hay que actualizarlo con
`railway domain update <dominio> --port <puerto>`.

---

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera el cliente Prisma y compila |
| `npm start` | Servidor de producción |
| `npm run typecheck` | Comprueba tipos sin emitir |
| `npm run db:migrate` | Aplica migraciones (`migrate deploy`) |
| `npm run db:seed` | Carga los datos de demostración |
| `npm run db:studio` | Prisma Studio |

---

## Contenido de demostración

Los ocho proyectos, las noticias y el equipo son **ficticios**, y las fotografías
provienen de Unsplash. Están pensados para reemplazarse desde `/admin` por el
material real del estudio.

El único dato tomado del perfil real
([@formafusion.ec](https://www.instagram.com/formafusion.ec/)) es el
posicionamiento —estudio de diseño y construcción en Ecuador— y el enlace de
WhatsApp, ambos editables en *Ajustes*.
