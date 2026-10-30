/**
 * handler/narsum.service.ts
 * ------------------------------------------------------------------
 * Semua query untuk tabel `rekapan_narsum`.
 *
 * Dua backend, dipilih otomatis dari env:
 *  - `POSTGREST_URL` terisi  -> HTTP (PostgREST), dipakai di Vercel
 *    saat Postgres hanya bisa dijangkau lewat Cloudflare Tunnel.
 *  - selain itu              -> SQL langsung via postgres.js.
 * Tanggal selalu dikirim keluar dalam format ISO (YYYY-MM-DD) dari
 * database, lalu diformat ke "4 March 2026" oleh `toApi()`.
 */

import { env } from "../config/env";
import { sql } from "../util/db";
import { pgDelete, pgGet, pgInsert, pgList, pgUpdate } from "../util/postgrest";
import { runWithWorkers, type WorkerResult } from "../util/pool";
import { toApi, type NarsumApi, type NarsumInput, type NarsumRow } from "../model/narsum.model";

/** Kolom select standar (tanggal -> teks ISO agar konsisten). */
const SELECT_COLUMNS = `
  id,
  nama,
  instansi,
  topik,
  to_char(tanggal_mulai, 'YYYY-MM-DD')   AS tanggal_mulai,
  to_char(tanggal_selesai, 'YYYY-MM-DD') AS tanggal_selesai,
  lokasi,
  mode_pelaksanaan
`;

/** Ambil semua data, urut dari tanggal mulai terlama. */
export async function listNarsum(): Promise<NarsumApi[]> {
  if (env.POSTGREST_URL) {
    const restRows = await pgList();
    return restRows.map(toApi);
  }

  const rows = (await sql.unsafe(
    `SELECT ${SELECT_COLUMNS} FROM rekapan_narsum ORDER BY tanggal_mulai ASC, id ASC`,
  )) as NarsumRow[];

  return rows.map(toApi);
}

/** Ambil satu data berdasarkan id. */
export async function getNarsumById(id: number): Promise<NarsumApi | null> {
  if (env.POSTGREST_URL) {
    const restRow = await pgGet(id);
    return restRow ? toApi(restRow) : null;
  }

  const rows = (await sql.unsafe(
    `SELECT ${SELECT_COLUMNS} FROM rekapan_narsum WHERE id = $1`,
    [id],
  )) as NarsumRow[];

  const row = rows[0];
  return row ? toApi(row) : null;
}

/** Insert satu baris, mengembalikan data yang tersimpan. */
export async function insertNarsum(input: NarsumInput): Promise<NarsumApi> {
  if (env.POSTGREST_URL) {
    return toApi(await pgInsert(input));
  }

  const rows = (await sql.unsafe(
    `INSERT INTO rekapan_narsum
       (nama, instansi, topik, tanggal_mulai, tanggal_selesai, lokasi, mode_pelaksanaan)
     VALUES ($1, $2, $3, $4::date, $5::date, $6, $7)
     RETURNING ${SELECT_COLUMNS}`,
    [
      input.nama,
      input.instansi,
      input.topik,
      input.tanggalMulai,
      input.tanggalSelesai,
      input.lokasi,
      input.modePelaksanaan,
    ],
  )) as NarsumRow[];

  return toApi(rows[0]!);
}

export interface BulkInsertResult {
  results: WorkerResult<NarsumApi>[];
  data: NarsumApi[];
  errors: { index: number; message: string; code?: string }[];
}

/**
 * Insert banyak baris secara paralel memakai worker pool
 * (default 3 worker, diatur lewat env INSERT_WORKERS).
 */
export async function insertMany(
  inputs: readonly NarsumInput[],
  workers: number,
): Promise<BulkInsertResult> {
  const results = await runWithWorkers(inputs, workers, (item) => insertNarsum(item));

  const data: NarsumApi[] = [];
  const errors: BulkInsertResult["errors"] = [];

  for (const result of results) {
    if (result.ok && result.value) {
      data.push(result.value);
    } else {
      errors.push({
        index: result.index,
        message: result.error ?? "Gagal menyimpan data",
        code: result.code,
      });
    }
  }

  return { results, data, errors };
}

/** Update seluruh field berdasarkan id. `null` bila id tidak ditemukan. */
export async function updateNarsum(id: number, input: NarsumInput): Promise<NarsumApi | null> {
  if (env.POSTGREST_URL) {
    const restRow = await pgUpdate(id, input);
    return restRow ? toApi(restRow) : null;
  }

  const rows = (await sql.unsafe(
    `UPDATE rekapan_narsum SET
       nama             = $1,
       instansi         = $2,
       topik            = $3,
       tanggal_mulai    = $4::date,
       tanggal_selesai  = $5::date,
       lokasi           = $6,
       mode_pelaksanaan = $7
     WHERE id = $8
     RETURNING ${SELECT_COLUMNS}`,
    [
      input.nama,
      input.instansi,
      input.topik,
      input.tanggalMulai,
      input.tanggalSelesai,
      input.lokasi,
      input.modePelaksanaan,
      id,
    ],
  )) as NarsumRow[];

  const row = rows[0];
  return row ? toApi(row) : null;
}

/** Hapus satu baris. Mengembalikan data yang dihapus, atau null. */
export async function deleteNarsum(id: number): Promise<NarsumApi | null> {
  if (env.POSTGREST_URL) {
    const restRow = await pgDelete(id);
    return restRow ? toApi(restRow) : null;
  }

  const rows = (await sql.unsafe(
    `DELETE FROM rekapan_narsum WHERE id = $1 RETURNING ${SELECT_COLUMNS}`,
    [id],
  )) as NarsumRow[];

  const row = rows[0];
  return row ? toApi(row) : null;
}
