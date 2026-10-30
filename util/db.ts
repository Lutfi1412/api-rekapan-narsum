/**
 * util/db.ts
 * ------------------------------------------------------------------
 * Satu pool PostgreSQL untuk seluruh aplikasi, memakai `postgres`
 * (postgres.js) sehingga jalan di **Bun** maupun **Node.js**
 * (Vercel Functions).
 *
 * Catatan serverless:
 * - `DB_POOL_MAX` kecil (3) supaya tidak menghabiskan koneksi.
 * - `DB_PREPARE=false` wajib untuk database ber-pooler (Supabase
 *   pgBouncer / Neon pooled connection).
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { env } from "../config/env";

type SqlClient = ReturnType<typeof postgres>;

let client: SqlClient | null = null;

/**
 * Pool dibuat lazy: pada mode gateway HTTP (PostgREST) aplikasi tidak
 * butuh koneksi TCP ke database, sehingga `DATABASE_URL` boleh kosong.
 */
export function getSql(): SqlClient {
  if (!client) {
    if (!env.DATABASE_URL) {
      throw new Error(
        "[DB] DATABASE_URL kosong. Isi `db_url` atau pakai mode gateway (POSTGREST_URL).",
      );
    }
    client = postgres(env.DATABASE_URL, {
      max: env.DB_POOL_MAX,
      idle_timeout: 30,
      connect_timeout: 5,
      prepare: env.DB_PREPARE,
      onnotice: () => {},
    });
  }
  return client;
}

/** Akses `sql\`...\`` / `sql.unsafe(...)` seperti biasa, tapi lazy. */
export const sql = new Proxy(function () {} as unknown as SqlClient, {
  apply(_target, _thisArg, args: unknown[]) {
    const instance = getSql() as unknown as (...a: unknown[]) => unknown;
    return instance(...args);
  },
  get(_target, prop) {
    const instance = getSql() as unknown as Record<string | symbol, unknown>;
    const value = instance[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
}) as SqlClient;

/** Cek koneksi database hidup atau tidak. */
export async function pingDb(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/** Tutup semua koneksi (dipakai saat shutdown / script CLI). */
export async function closeDb(): Promise<void> {
  if (!client) return;
  await client.end({ timeout: 5 });
}

/**
 * Jalankan file .sql (boleh berisi banyak statement sekaligus),
 * dipakai oleh `util/migrate.ts` untuk schema & seed.
 */
export async function runSqlFile(file: string | URL): Promise<void> {
  const path = typeof file === "string" ? file : fileURLToPath(file);
  const content = await readFile(path, "utf8");
  if (!content.trim()) return;
  await sql.unsafe(content);
}

/** Jumlah baris pada tabel utama (untuk verifikasi setelah seed). */
export async function countRows(): Promise<number> {
  const rows = await sql`SELECT count(*)::int AS total FROM rekapan_narsum`;
  const row = rows[0] as { total: number } | undefined;
  return Number(row?.total ?? 0);
}
