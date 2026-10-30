/**
 * app.ts — konstruksi instance Elysia (tanpa listen)
 * ------------------------------------------------------------------
 * Dipisah dari `index.ts` supaya bisa di-import pada unit test
 * (`app.handle(new Request(...))`) tanpa membuka port.
 */

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import { env } from "./config/env";
import { authRoutes } from "./handler/auth.handler";
import { healthRoutes } from "./handler/health.handler";
import { narsumAdminRoutes, narsumPublicRoutes } from "./handler/narsum.handler";

const allowedOrigins =
  env.CORS_ORIGIN === "*"
    ? true
    : env.CORS_ORIGIN.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

export const app = new Elysia()
  .use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "API Rekapan Narsum TSI",
          version: "1.0.0",
          description:
            "REST API CRUD rekapan narasumber. Login di `POST /login` untuk mendapatkan token, lalu kirim `Authorization: Bearer <token>` ke endpoint admin.",
        },
        tags: [
          { name: "Auth", description: "Login & cek token" },
          { name: "Narsum (User)", description: "Akses publik, tanpa token" },
          { name: "Narsum (Admin)", description: "Wajib Bearer token hasil login" },
          { name: "System", description: "Health check" },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "token",
            },
          },
        },
      },
    }),
  )
  .use(healthRoutes)
  .use(authRoutes)
  .use(narsumPublicRoutes)
  .use(narsumAdminRoutes)
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 422;
      return {
        success: false,
        statusCode: 422,
        message: "Validasi request gagal",
        errors:
          (error as { all?: { path?: string; message?: string }[] }).all?.map((item) => ({
            path: item.path,
            message: item.message,
          })) ?? [],
        data: null,
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        success: false,
        statusCode: 404,
        message: "Endpoint tidak ditemukan",
        data: null,
      };
    }

    if (code === "PARSE") {
      set.status = 400;
      return {
        success: false,
        statusCode: 400,
        message: "Body request bukan JSON yang valid",
        data: null,
      };
    }

    console.error("[ERROR]", code, error);
    set.status = 500;
    return {
      success: false,
      statusCode: 500,
      message: "Terjadi kesalahan pada server",
      data:
        env.NODE_ENV === "production"
          ? null
          : { detail: String((error as Error)?.message ?? error) },
    };
  });

export default app;
