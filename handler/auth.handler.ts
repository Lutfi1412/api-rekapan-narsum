/**
 * handler/auth.handler.ts
 * ------------------------------------------------------------------
 * Autentikasi admin.
 *
 *   POST /login  -> { username, password } => token JWT
 *   GET  /me     -> cek token yang sedang dipakai (butuh Bearer)
 */

import { Elysia, t } from "elysia";
import { checkCredentials, extractBearer, verifyAdmin } from "../middleware/auth.middleware";
import { signToken, verifyToken } from "../util/jwt";

const bearer = [{ bearerAuth: [] as string[] }];

/** Body login: semua field opsional di TypeBox, validasi di handler. */
const loginBody = t.Object({
  username: t.Optional(t.String({ description: "Username admin", examples: ["admin"] })),
  user: t.Optional(t.String({ description: "Alias untuk username" })),
  password: t.Optional(t.String({ description: "Password admin", examples: ["admin"] })),
  pass: t.Optional(t.String({ description: "Alias untuk password" })),
});

export const authRoutes = new Elysia({
  name: "auth",
  detail: { tags: ["Auth"] },
})
  .post(
    "/login",
    async ({ body, status }) => {
      const raw = (body ?? {}) as Record<string, unknown>;
      const username = raw.username ?? raw.user;
      const password = raw.password ?? raw.pass;

      if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
        return status(422, {
          success: false,
          statusCode: 422,
          message: "Validasi payload gagal",
          errors: [
            ...(typeof username !== "string" || !username.trim()
              ? [{ field: "username", message: "username wajib diisi" }]
              : []),
            ...(typeof password !== "string" || !password
              ? [{ field: "password", message: "password wajib diisi" }]
              : []),
          ],
          data: null,
        });
      }

      if (!checkCredentials(username, password)) {
        return status(401, {
          success: false,
          statusCode: 401,
          message: "Username atau password salah",
          data: null,
        });
      }

      const issued = await signToken(username.trim().toLowerCase());

      return status(200, {
        success: true,
        statusCode: 200,
        message: "Login berhasil",
        data: {
          token: issued.token,
          tokenType: issued.tokenType,
          expiresIn: issued.expiresIn,
          expiresAt: issued.expiresAtIso,
          user: {
            username: username.trim().toLowerCase(),
            role: "admin",
          },
        },
      });
    },
    {
      body: loginBody,
      detail: {
        summary: "Login admin — dapatkan token",
        description:
          "Kirim username & password (default: admin / admin). Response berisi JWT yang dipakai sebagai `Authorization: Bearer <token>` pada semua endpoint admin. Masa berlaku token diatur `JWT_EXPIRES_IN` (default 12 jam).",
        tags: ["Auth"],
      },
    },
  )
  .guard({ beforeHandle: verifyAdmin }, (app) =>
    app.get(
      "/me",
      async ({ headers, status }) => {
        const token = extractBearer(headers.authorization);
        if (!token) {
          return status(401, {
            success: false,
            statusCode: 401,
            message: "Unauthorized: token tidak ditemukan",
            data: null,
          });
        }

        const payload = await verifyToken(token);
        return status(200, {
          success: true,
          statusCode: 200,
          message: "Token valid",
          data: {
            username: payload.username ?? payload.sub ?? "admin",
            role: payload.role ?? "admin",
            issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : null,
            expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
          },
        });
      },
      {
        detail: {
          summary: "Cek token yang sedang aktif",
          description: "Memastikan token masih valid dan menampilkan waktu kedaluwarsanya.",
          tags: ["Auth"],
          security: bearer,
        },
      },
    ),
  );
