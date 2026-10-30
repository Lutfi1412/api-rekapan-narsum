/**
 * util/jwt.ts
 * ------------------------------------------------------------------
 * Pembuatan & verifikasi JWT (HS256) memakai `jose`.
 *
 * Secret dibaca dari `JWT_SECRET` di .env, lalu diturunkan menjadi
 * 32 byte via SHA-256 supaya panjang secret bebas (jose mensyaratkan
 * minimal 256 bit untuk HS256).
 */

import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { env } from "../config/env";

const ISSUER = "api-rekapan-narsum-tsi";
const ALGORITHM = "HS256";

let cachedKey: Uint8Array | null = null;

/** Turunkan secret apa pun menjadi kunci 256-bit yang stabil. */
async function getKey(): Promise<Uint8Array> {
  if (cachedKey) return cachedKey;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(env.JWT_SECRET));
  cachedKey = new Uint8Array(digest);
  return cachedKey;
}

/** "12h" | "30m" | "7d" | "3600" (detik) -> detik */
export function parseDuration(value: string): number {
  const raw = value.trim().toLowerCase();
  const match = /^(\d+)\s*([smhd])?$/.exec(raw);
  if (!match) return 12 * 60 * 60;

  const amount = Number(match[1]);
  switch (match[2]) {
    case "s":
      return amount;
    case "m":
      return amount * 60;
    case "h":
      return amount * 60 * 60;
    case "d":
      return amount * 24 * 60 * 60;
    default:
      return amount;
  }
}

export interface IssuedToken {
  token: string;
  tokenType: "Bearer";
  expiresIn: string;
  /** Unix timestamp (detik) kapan token kedaluwarsa. */
  expiresAt: number;
  /** Waktu kedaluwarsa dalam ISO 8601. */
  expiresAtIso: string;
}

/** Buat token untuk user yang berhasil login. */
export async function signToken(username: string, role = "admin"): Promise<IssuedToken> {
  const now = Math.floor(Date.now() / 1000);
  const ttl = parseDuration(env.JWT_EXPIRES_IN);
  const exp = now + ttl;

  const token = await new SignJWT({ username, role })
    .setProtectedHeader({ alg: ALGORITHM, typ: "JWT" })
    .setSubject(username)
    .setIssuer(ISSUER)
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(await getKey());

  return {
    token,
    tokenType: "Bearer",
    expiresIn: env.JWT_EXPIRES_IN,
    expiresAt: exp,
    expiresAtIso: new Date(exp * 1000).toISOString(),
  };
}

export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

/** Verifikasi token; melempar `TokenError` bila tidak valid/kedaluwarsa. */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, await getKey(), {
      issuer: ISSUER,
      algorithms: [ALGORITHM],
    });
    return payload;
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "ERR_JWT_EXPIRED") {
      throw new TokenError("Token sudah kedaluwarsa, silakan login ulang");
    }
    throw new TokenError("Token tidak valid");
  }
}
