/**
 * util/postgrest.ts
 * ------------------------------------------------------------------
 * Client tipis untuk gateway PostgREST (HTTP).
 *
 * Dipakai saat API berjalan di Vercel dan Postgres berada di VPS yang
 * hanya bisa dijangkau lewat Cloudflare Tunnel (HTTP/HTTPS). Semua
 * request membawa JWT role `web_user`; tanpa token PostgREST menolak
 * (401) karena `web_anon` tidak diberi hak apa pun.
 */

import { env } from "../config/env";
import type { NarsumInput, NarsumRow } from "../model/narsum.model";

const TABLE = "rekapan_narsum";

/** Kolom yang dipakai API (tanpa created_at/updated_at). */
const COLUMNS = "id,nama,instansi,topik,tanggal_mulai,tanggal_selesai,lokasi,mode_pelaksanaan";

/** Error gateway; `errno` berisi SQLSTATE dari Postgres (mis. 23505). */
export class PostgrestError extends Error {
  errno?: string;
  code?: string;
  detail?: string;
  status?: number;

  constructor(
    message: string,
    options: { errno?: string; detail?: string; status?: number; code?: string } = {},
  ) {
    super(message);
    this.name = "PostgrestError";
    this.errno = options.errno;
    this.code = options.code;
    this.detail = options.detail;
    this.status = options.status;
  }
}

function buildHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Profile": "public",
    ...extra,
  };
  if (env.POSTGREST_JWT) headers.Authorization = `Bearer ${env.POSTGREST_JWT}`;
  return headers;
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!env.POSTGREST_URL) {
    throw new PostgrestError("[DB] POSTGREST_URL belum diisi.", { code: "CONFIG" });
  }

  const url = `${env.POSTGREST_URL}/${path}`;
  const headers = buildHeaders((init.headers as Record<string, string> | undefined) ?? {});

  let response: Response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch (error) {
    throw new PostgrestError(
      `Gagal menghubungi gateway database: ${(error as Error).message}`,
      { code: "GATEWAY_UNREACHABLE" },
    );
  }

  const text = await response.text();

  if (!response.ok) {
    let payload: { message?: string; code?: string; details?: string } = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { message: text.slice(0, 300) };
    }
    throw new PostgrestError(payload.message ?? `Gateway HTTP ${response.status}`, {
      errno: payload.code,
      detail: payload.details,
      status: response.status,
    });
  }

  if (!text) return null as T;
  return JSON.parse(text) as T;
}

/** Payload API -> bentuk kolom tabel. */
function toRow(input: NarsumInput): Record<string, string> {
  return {
    nama: input.nama,
    instansi: input.instansi,
    topik: input.topik,
    tanggal_mulai: input.tanggalMulai,
    tanggal_selesai: input.tanggalSelesai,
    lokasi: input.lokasi,
    mode_pelaksanaan: input.modePelaksanaan,
  };
}

/** Semua baris, urut tanggal mulai lalu id. */
export async function pgList(): Promise<NarsumRow[]> {
  return call<NarsumRow[]>(`${TABLE}?select=${COLUMNS}&order=tanggal_mulai.asc,id.asc`);
}

/** Satu baris berdasarkan id. */
export async function pgGet(id: number): Promise<NarsumRow | null> {
  const rows = await call<NarsumRow[]>(`${TABLE}?select=${COLUMNS}&id=eq.${id}`);
  return rows[0] ?? null;
}

/** Insert satu baris, mengembalikan baris tersimpan. */
export async function pgInsert(input: NarsumInput): Promise<NarsumRow> {
  const rows = await call<NarsumRow[]>(TABLE, {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(toRow(input)),
  });
  const row = rows[0];
  if (!row) throw new PostgrestError("Gateway tidak mengembalikan data tersimpan");
  return row;
}

/** Update penuh satu baris. */
export async function pgUpdate(id: number, input: NarsumInput): Promise<NarsumRow | null> {
  const rows = await call<NarsumRow[]>(`${TABLE}?id=eq.${id}&select=${COLUMNS}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(toRow(input)),
  });
  return rows[0] ?? null;
}

/** Hapus satu baris, mengembalikan baris yang dihapus. */
export async function pgDelete(id: number): Promise<NarsumRow | null> {
  const rows = await call<NarsumRow[]>(`${TABLE}?id=eq.${id}&select=${COLUMNS}`, {
    method: "DELETE",
    headers: { Prefer: "return=representation" },
  });
  return rows[0] ?? null;
}

/** Cek gateway + database hidup. */
export async function pgPing(): Promise<boolean> {
  try {
    await call<unknown>(`${TABLE}?select=id&limit=1`);
    return true;
  } catch {
    return false;
  }
}
