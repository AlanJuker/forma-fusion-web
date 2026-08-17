import { NextResponse } from "next/server";

import { prisma } from "@/infrastructure/persistence/prisma/client";

export const dynamic = "force-dynamic";

/**
 * Health check para Railway. Comprueba también la conexión a Postgres: un
 * proceso que responde pero no alcanza la base de datos no está sano.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "up" });
  } catch {
    return NextResponse.json(
      { status: "degraded", database: "down" },
      { status: 503 },
    );
  }
}
