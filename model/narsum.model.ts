/**
 * model/narsum.model.ts
 * ------------------------------------------------------------------
 * Tipe data, skema request (TypeBox -> otomatis jadi docs Swagger),
 * serta normalisasi & validasi payload.
 *
 * Payload boleh memakai gaya template ("Nama", "Tanggal Mulai", ...)
 * maupun snake_case / camelCase agar mudah dipakai dari frontend.
 */

import { t } from "elysia";
import { formatDateDisplay, parseDateToIso } from "../util/date";

/** Payload yang sudah dinormalisasi & siap masuk database. */
export interface NarsumInput {
  nama: string;
  instansi: string;
  topik: string;
  tanggalMulai: string; // ISO YYYY-MM-DD
  tanggalSelesai: string; // ISO YYYY-MM-DD
  lokasi: string;
  modePelaksanaan: string;
}

/** Baris tabel `rekapan_narsum` (tanggal sudah diformat ISO oleh query). */
export interface NarsumRow {
  id: number | string;
  nama: string;
  instansi: string;
  topik: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  mode_pelaksanaan: string;
}

/** Bentuk response sesuai template (key ber-spasi, huruf kapital). */
export interface NarsumApi {
  id: number;
  "Nama": string;
  "Instansi": string;
  "Topik": string;
  "Tanggal Mulai": string;
  "Tanggal Selesai": string;
  "Lokasi": string;
  "Mode Pelaksanaan": string;
}

export interface ValidationIssue {
  /** Posisi item pada payload array (0-based). */
  index: number;
  field: string;
  message: string;
}

/** Nama key payload yang diterima untuk setiap field. */
const ALIASES: Record<keyof NarsumInput, string[]> = {
  nama: ["Nama", "nama", "name"],
  instansi: ["Instansi", "instansi", "institution", "agency"],
  topik: ["Topik", "topik", "topic"],
  tanggalMulai: ["Tanggal Mulai", "tanggal_mulai", "tanggalMulai", "start_date", "startDate"],
  tanggalSelesai: ["Tanggal Selesai", "tanggal_selesai", "tanggalSelesai", "end_date", "endDate"],
  lokasi: ["Lokasi", "lokasi", "location", "tempat"],
  modePelaksanaan: [
    "Mode Pelaksanaan",
    "mode_pelaksanaan",
    "modePelaksanaan",
    "mode",
    "pelaksanaan",
  ],
};

const MAX_LENGTH: Partial<Record<keyof NarsumInput, number>> = {
  nama: 200,
  instansi: 500,
  topik: 500,
  lokasi: 500,
  modePelaksanaan: 50,
};

const optionalString = t.Optional(t.String({ minLength: 1 }));

/**
 * Skema body: semua field opsional di level TypeBox karena validasi
 * lengkap (termasuk alias key) dilakukan di `validateBatch()` — sehingga
 * pesan error bisa menyebut index & field yang salah.
 */
export const NarsumBodySchema = t.Object(
  {
    "Nama": optionalString,
    nama: optionalString,
    name: optionalString,

    "Instansi": optionalString,
    instansi: optionalString,
    institution: optionalString,

    "Topik": optionalString,
    topik: optionalString,
    topic: optionalString,

    "Tanggal Mulai": optionalString,
    tanggal_mulai: optionalString,
    tanggalMulai: optionalString,
    start_date: optionalString,

    "Tanggal Selesai": optionalString,
    tanggal_selesai: optionalString,
    tanggalSelesai: optionalString,
    end_date: optionalString,

    "Lokasi": optionalString,
    lokasi: optionalString,
    location: optionalString,

    "Mode Pelaksanaan": optionalString,
    mode_pelaksanaan: optionalString,
    modePelaksanaan: optionalString,
    mode: optionalString,
  },
);

/** Body endpoint create: satu object ATAU array object. */
export const NarsumPayloadSchema = t.Union([
  NarsumBodySchema,
  t.Array(NarsumBodySchema, { minItems: 1, maxItems: 1000 }),
]);

/** Response object publik (dipakai untuk dokumentasi Swagger). */
export const NarsumApiSchema = t.Object({
  id: t.Number(),
  Nama: t.String(),
  Instansi: t.String(),
  Topik: t.String(),
  "Tanggal Mulai": t.String(),
  "Tanggal Selesai": t.String(),
  Lokasi: t.String(),
  "Mode Pelaksanaan": t.String(),
});

/** Baris DB -> bentuk response template. */
export function toApi(row: NarsumRow): NarsumApi {
  return {
    id: Number(row.id),
    "Nama": row.nama,
    "Instansi": row.instansi,
    "Topik": row.topik,
    "Tanggal Mulai": formatDateDisplay(row.tanggal_mulai),
    "Tanggal Selesai": formatDateDisplay(row.tanggal_selesai),
    "Lokasi": row.lokasi,
    "Mode Pelaksanaan": row.mode_pelaksanaan,
  };
}

/** Ambil nilai string pertama yang tersedia dari daftar alias. */
function pickString(raw: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = raw[key];
    if (value === undefined || value === null) continue;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed !== "") return trimmed;
      continue;
    }
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return undefined;
}

/** "online" | "daring" -> "Online"; "offline" -> "Offline"; dst. */
export function normalizeMode(value: string): string {
  const lower = value.trim().toLowerCase();
  if (["online", "daring", "virtual", "online (daring)"].includes(lower)) return "Online";
  if (["offline", "luring", "tatap muka", "onsite", "offline (luring)"].includes(lower)) return "Offline";
  if (["hybrid", "hybrida", "blended", "campuran"].includes(lower)) return "Hybrid";
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Normalisasi + validasi satu item payload.
 * Mengembalikan `value` bila valid, atau daftar `issues` bila tidak.
 */
export function normalizePayload(
  raw: unknown,
  index: number,
): { value?: NarsumInput; issues: ValidationIssue[] } {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return {
      issues: [{ index, field: "-", message: "Setiap item harus berupa object" }],
    };
  }

  const record = raw as Record<string, unknown>;
  const issues: ValidationIssue[] = [];

  const values: Partial<NarsumInput> = {};

  for (const field of Object.keys(ALIASES) as (keyof NarsumInput)[]) {
    const value = pickString(record, ALIASES[field]);
    if (!value) {
      issues.push({
        index,
        field: ALIASES[field][0]!,
        message: `${ALIASES[field][0]} wajib diisi`,
      });
      continue;
    }
    const limit = MAX_LENGTH[field];
    if (limit && value.length > limit) {
      issues.push({
        index,
        field: ALIASES[field][0]!,
        message: `Maksimal ${limit} karakter (saat ini ${value.length})`,
      });
      continue;
    }
    (values as Record<string, unknown>)[field] = value;
  }

  // Validasi tanggal
  const startRaw = values.tanggalMulai;
  const endRaw = values.tanggalSelesai;

  if (startRaw) {
    const iso = parseDateToIso(startRaw);
    if (!iso) {
      issues.push({
        index,
        field: "Tanggal Mulai",
        message: `Format tanggal tidak dikenali: "${startRaw}". Gunakan "4 March 2026" atau "2026-03-04".`,
      });
    } else {
      values.tanggalMulai = iso;
    }
  }

  if (endRaw) {
    const iso = parseDateToIso(endRaw);
    if (!iso) {
      issues.push({
        index,
        field: "Tanggal Selesai",
        message: `Format tanggal tidak dikenali: "${endRaw}". Gunakan "5 March 2026" atau "2026-03-05".`,
      });
    } else {
      values.tanggalSelesai = iso;
    }
  }

  if (issues.length > 0) return { issues };

  if (values.tanggalSelesai! < values.tanggalMulai!) {
    issues.push({
      index,
      field: "Tanggal Selesai",
      message: "Tanggal Selesai tidak boleh lebih awal dari Tanggal Mulai",
    });
    return { issues };
  }

  return {
    value: {
      nama: values.nama!,
      instansi: values.instansi!,
      topik: values.topik!,
      tanggalMulai: values.tanggalMulai!,
      tanggalSelesai: values.tanggalSelesai!,
      lokasi: values.lokasi!,
      modePelaksanaan: normalizeMode(values.modePelaksanaan!),
    },
    issues: [],
  };
}

/**
 * Validasi body request: object tunggal atau array object.
 * Semua item divalidasi lebih dulu — bila ada yang salah,
 * tidak ada satu pun baris yang dimasukkan (fail fast).
 */
export function validateBatch(body: unknown): {
  values: NarsumInput[];
  issues: ValidationIssue[];
} {
  const items = Array.isArray(body) ? body : [body];
  const values: NarsumInput[] = [];
  const issues: ValidationIssue[] = [];

  items.forEach((item, index) => {
    const result = normalizePayload(item, index);
    if (result.value) values.push(result.value);
    issues.push(...result.issues);
  });

  return { values, issues };
}
