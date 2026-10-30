/**
 * index.ts — entry point API Rekapan Narsum TSI
 * ------------------------------------------------------------------
 * Lokal (Bun):
 *   bun run dev     -> watch
 *   bun run start   -> normal
 *
 * Vercel:
 *   File ini (dan `app.ts`) diekspor sebagai default export. Vercel
 *   mendeteksi Elysia otomatis, jadi `app.listen()` sengaja dilewati
 *   saat berjalan di serverless (`process.env.VERCEL` terisi).
 */

import { app } from "./app";
import { env } from "./config/env";
import { closeDb } from "./util/db";

const isServerless = Boolean(process.env.VERCEL);

if (!isServerless) {
  app.listen({ port: env.PORT, hostname: env.HOST });

  const host = env.HOST === "0.0.0.0" ? "localhost" : env.HOST;
  const baseUrl = `http://${host}:${app.server?.port ?? env.PORT}`;

  console.log(`\n🚀 API Rekapan Narsum TSI berjalan di ${baseUrl}`);
  console.log(`📚 Dokumentasi Swagger : ${baseUrl}/docs`);
  console.log(`❤️  Health check        : ${baseUrl}/health`);
  console.log(
    `🔐 Login admin         : POST /login (user: ${env.ADMIN_USERNAME}) — token JWT berlaku ${env.JWT_EXPIRES_IN}`,
  );
  console.log(`🧵 Worker bulk insert  : ${env.INSERT_WORKERS}\n`);

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n[${signal}] Menutup server & koneksi database...`);
    try {
      await app.stop();
      await closeDb();
    } finally {
      process.exit(0);
    }
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

export { app };
export default app;
