/**
 * config/env.ts
 * ------------------------------------------------------------------
 * Memuat & memvalidasi environment variable satu kali di awal.
 * Bun otomatis membaca file `.env` (tanpa library tambahan).
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(
      `[ENV] Variable "${name}" wajib diisi. Cek file .env (lihat .env.example).`,
    );
  }
  return value.trim();
}

function optionalNumber(name: string, value: string | undefined, fallback: number): number {
  if (!value || value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`[ENV] Variable "${name}" harus berupa angka > 0 (diterima: "${value}").`);
  }
  return parsed;
}

/** URL gateway PostgREST (tanpa slash di akhir). Kosong = pakai PostgreSQL langsung. */
const postgrestUrl = (process.env.POSTGREST_URL ?? "").trim().replace(/\/+$/, "");

/** Mode gateway HTTP aktif bila POSTGREST_URL diisi. */
export const USE_POSTGREST = postgrestUrl !== "";

/** `db_url` diutamakan, `DATABASE_URL` dipakai sebagai alias. */
const databaseUrl = USE_POSTGREST
  ? (process.env.db_url ?? process.env.DATABASE_URL ?? "").trim()
  : required("db_url / DATABASE_URL", process.env.db_url ?? process.env.DATABASE_URL);

export const env = {
  /** Connection string PostgreSQL (mode langsung). */
  DATABASE_URL: databaseUrl,
  /** Gateway PostgREST (mode HTTP), dipakai bila Postgres tidak bisa diakses via TCP. */
  POSTGREST_URL: postgrestUrl,
  /** JWT role `web_user` untuk PostgREST. */
  POSTGREST_JWT: (process.env.POSTGREST_JWT ?? "").trim(),
  /** Batas koneksi pool. */
  DB_POOL_MAX: optionalNumber("DB_POOL_MAX", process.env.DB_POOL_MAX, 10),
  /** Prepared statement; set false bila memakai pooler (pgBouncer/Neon). */
  DB_PREPARE: (process.env.DB_PREPARE ?? "true").trim().toLowerCase() !== "false",

  PORT: optionalNumber("PORT", process.env.PORT, 3000),
  HOST: process.env.HOST?.trim() || "0.0.0.0",

  /** Secret key untuk menandatangani JWT (dipakai endpoint login). */
  JWT_SECRET: required("JWT_SECRET", process.env.JWT_SECRET),
  /** Masa berlaku token, mis. "12h", "30m", "7d". */
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN?.trim() || "12h",

  /** Kredensial admin untuk POST /login. */
  ADMIN_USERNAME: process.env.ADMIN_USERNAME?.trim() || "admin",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD?.trim() || "admin",

  /** "*" atau daftar origin dipisah koma. */
  CORS_ORIGIN: process.env.CORS_ORIGIN?.trim() || "*",

  /** Jumlah worker paralel untuk bulk insert. */
  INSERT_WORKERS: optionalNumber("INSERT_WORKERS", process.env.INSERT_WORKERS, 3),

  NODE_ENV: process.env.NODE_ENV?.trim() || "development",
} as const;

export const isProduction = env.NODE_ENV === "production";
