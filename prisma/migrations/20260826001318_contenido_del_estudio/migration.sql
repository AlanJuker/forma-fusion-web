-- Adapta el esquema al contenido del documento del estudio.
--
-- Parte del esquema inicial (migración `init`) y lo transforma en lugar de
-- recrearlo: en producción esas tablas ya existen y tienen datos.

-- 1. Estados de obra con la nomenclatura del estudio.
--    El tipo se sustituye entero (en PostgreSQL no se pueden retirar valores
--    de un enum) traduciendo por el camino los estados antiguos.
CREATE TYPE "ProjectStatus_new" AS ENUM ('DELIVERED', 'IN_OPERATION', 'FOR_SALE', 'IN_PROGRESS');

ALTER TABLE "projects" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "projects"
  ALTER COLUMN "status" TYPE "ProjectStatus_new"
  USING (
    CASE "status"::text
      WHEN 'COMPLETED'   THEN 'DELIVERED'
      WHEN 'CONCEPT'     THEN 'IN_PROGRESS'
      WHEN 'IN_PROGRESS' THEN 'IN_PROGRESS'
      ELSE 'DELIVERED'
    END
  )::"ProjectStatus_new";

DROP TYPE "ProjectStatus";
ALTER TYPE "ProjectStatus_new" RENAME TO "ProjectStatus";

ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 'DELIVERED';

-- 2. Encuadre de la portada: en fotografías verticales el recorte centrado
--    deja el edificio fuera del marco.
ALTER TABLE "projects" ADD COLUMN "coverPosition" TEXT NOT NULL DEFAULT 'center';

-- 3. Secciones que el documento del estudio no recoge. Sus datos eran de
--    demostración y el sitio ya no las referencia en ninguna parte.
DROP TABLE IF EXISTS "news_posts";
DROP TABLE IF EXISTS "team_members";
DROP TABLE IF EXISTS "offices";
