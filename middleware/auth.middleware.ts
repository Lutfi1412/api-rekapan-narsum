/**
 * middleware/auth.middleware.ts
 * ------------------------------------------------------------------
 * Proteksi endpoint admin memakai JWT yang diperoleh dari POST /login.
 *
 * Alur:
 *   1. POST /login  -> dapat token (Bearer)
 *   2. Request admin: header `Authorization: Bearer <token>`
 *   3. Guard memverifikasi signature + masa berlaku (exp) token.
 */

import { timingSafeEqual } from "node:crypto";
import { env } from "../config/env";
import { verifyToken } from "../util/jwt";

/** Ambil token dari header "Authorization: Bearer <token>". */
export function extractBearer(header?: string | null): string | null {
  if (!header) return null;
  const parts = header.trim().split(/\s+/);
  if (parts.length !== 2) return null;
  const [scheme, token] = parts;
  if (scheme?.toLowerCase() !== "bearer") return null;
  return token?.trim() || null;
}

/** Perbandingan constant-time (aman dari timing attack). */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** Validasi username & password login terhadap env. */
export function checkCredentials(username: unknown, password: unknown): boolean {
  if (typeof username !== "string" || typeof password !== "string") return false;
  if (!username.trim() || !password) return false;

  const userOk = safeEqual(username.trim().toLowerCase(), env.ADMIN_USERNAME.toLowerCase());
  const passOk = safeEqual(password, env.ADMIN_PASSWORD);
  return userOk && passOk;
}

export interface AuthContext {
  headers: Record<string, string | undefined>;
  status: (code: number, body: unknown) => unknown;
}

function unauthorized(status: AuthContext["status"], message: string) {
  return status(401, {
    success: false,
    statusCode: 401,
    message,
    data: null,
  });
}

/**
 * beforeHandle guard. Dipakai lewat `.guard({ beforeHandle: verifyAdmin })`
 * sehingga hanya route admin yang terkena.
 */
export async function verifyAdmin({ headers, status }: AuthContext) {
  const token = extractBearer(headers.authorization);

  if (!token) {
    return unauthorized(
      status,
      "Unauthorized: kirim header 'Authorization: Bearer <token>' (token dari POST /login)",
    );
  }

  try {
    await verifyToken(token);
  } catch (error) {
    return unauthorized(status, `Unauthorized: ${(error as Error).message}`);
  }
}
