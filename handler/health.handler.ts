/**
 * handler/health.handler.ts
 * ------------------------------------------------------------------
 * Endpoint cek kesehatan service + koneksi database.
 */

import { Elysia } from "elysia";
import { env } from "../config/env";
import { pingDb } from "../util/db";
import { pgPing } from "../util/postgrest";

export const healthRoutes = new Elysia({
  name: "health",
  detail: { tags: ["System"] },
}).get(
  "/health",
  async ({ status }) => {
    const viaGateway = Boolean(env.POSTGREST_URL);
    const dbUp = viaGateway ? await pgPing() : await pingDb();

    return status(dbUp ? 200 : 503, {
      success: dbUp,
      statusCode: dbUp ? 200 : 503,
      message: dbUp ? "OK" : "Database tidak dapat dihubungi",
      data: {
        service: "api-rekapan-narsum-tsi",
        database: dbUp ? "up" : "down",
        databaseMode: viaGateway ? "postgrest-gateway" : "direct-postgres",
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
      },
    });
  },
  {
    detail: {
      summary: "Health check",
      description:
        "Memeriksa status service dan koneksi database (langsung ke PostgreSQL atau lewat gateway PostgREST).",
      tags: ["System"],
    },
  },
);
