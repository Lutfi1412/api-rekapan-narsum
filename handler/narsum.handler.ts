/**
 * handler/narsum.handler.ts
 * ------------------------------------------------------------------
 * Definisi route HTTP.
 *
 *  Publik (tanpa token)
 *    GET    /
 *
 *  Admin (login dulu di POST /login, lalu kirim header Authorization)
 *    GET    /admin
 *    POST   /create
 *    PUT    /update/:id
 *    DELETE /delete/:id
 */

import { Elysia, t } from "elysia";
import { env } from "../config/env";
import { verifyAdmin } from "../middleware/auth.middleware";
import { validateBatch } from "../model/narsum.model";
import { deleteNarsum, insertMany, listNarsum, updateNarsum } from "./narsum.service";

const bearer = [{ bearerAuth: [] as string[] }];

/** Terjemahkan error PostgreSQL menjadi pesan yang ramah. */
function friendlyError(code: string | undefined, message: string): string {
  if (code === "23505") {
    return "Data duplikat: kombinasi Nama + Topik + Tanggal Mulai sudah ada";
  }
  if (code === "23514") {
    return "Data ditolak oleh aturan database (cek tanggal / field kosong)";
  }
  return message;
}

const idParams = t.Object({
  id: t.Numeric({ minimum: 1, description: "ID data" }),
});

/** ---------------- ROUTE PUBLIK (tanpa token) ---------------- */
export const narsumPublicRoutes = new Elysia({
  name: "narsum-public",
  detail: { tags: ["Narsum (User)"] },
}).get("/", () => listNarsum(), {
  detail: {
    summary: "Ambil semua data rekapan narasumber",
    description:
      "Endpoint publik, tanpa Bearer token. Response berupa array dengan key sesuai template (Nama, Instansi, Topik, Tanggal Mulai, Tanggal Selesai, Lokasi, Mode Pelaksanaan).",
    tags: ["Narsum (User)"],
  },
});

/** ---------------- ROUTE ADMIN (wajib Bearer token) ---------------- */
export const narsumAdminRoutes = new Elysia({
  name: "narsum-admin",
  detail: { tags: ["Narsum (Admin)"] },
}).guard({ beforeHandle: verifyAdmin }, (app) =>
  app
    .get("/admin", () => listNarsum(), {
      detail: {
        summary: "Ambil semua data (admin)",
        description: "Sama seperti GET / tetapi wajib Bearer token.",
        tags: ["Narsum (Admin)"],
        security: bearer,
      },
    })

    .post(
      "/create",
      async ({ body, status }) => {
        // 1) Validasi semua item lebih dulu (fail fast, tanpa partial insert)
        const { values, issues } = validateBatch(body);
        if (issues.length > 0) {
          return status(422, {
            success: false,
            statusCode: 422,
            message: "Validasi payload gagal",
            errors: issues,
            data: null,
          });
        }

        // 2) Insert paralel dengan worker pool (default 3 worker)
        const { data, errors } = await insertMany(values, env.INSERT_WORKERS);
        const failed = errors.length;
        const inserted = data.length;
        const allDuplicate = failed > 0 && errors.every((item) => item.code === "23505");

        const payload = {
          success: failed === 0,
          statusCode: failed === 0 ? 201 : inserted > 0 ? 207 : allDuplicate ? 409 : 422,
          message:
            failed === 0
              ? `${inserted} data berhasil disimpan`
              : inserted > 0
                ? `${inserted} data berhasil, ${failed} data gagal`
                : allDuplicate
                  ? "Semua data duplikat, tidak ada yang disimpan"
                  : "Semua data gagal disimpan",
          total: values.length,
          inserted,
          failed,
          workers: env.INSERT_WORKERS,
          data,
          errors: errors.map((item) => ({
            index: item.index,
            code: item.code,
            message: friendlyError(item.code, item.message),
          })),
        };

        if (failed === 0) return status(201, payload);
        return status(inserted > 0 ? 207 : allDuplicate ? 409 : 422, payload);
      },
      {
        body: t.Any({ description: "Object tunggal atau array object (lihat contoh pada README/Postman)" }),
        detail: {
          summary: "Tambah data (tunggal atau banyak sekaligus)",
          description:
            "Body boleh satu object atau array object. Setiap item wajib berisi 7 field: Nama, Instansi, Topik, Tanggal Mulai, Tanggal Selesai, Lokasi, Mode Pelaksanaan. Array diproses paralel oleh 3 worker (env INSERT_WORKERS). Bila ada item tidak valid, tidak ada data yang disimpan.",
          tags: ["Narsum (Admin)"],
          security: bearer,
        },
      },
    )

    .put(
      "/update/:id",
      async ({ body, params, status }) => {
        if (Array.isArray(body)) {
          return status(422, {
            success: false,
            statusCode: 422,
            message: "Body update harus berupa satu object, bukan array",
            errors: [{ index: 0, field: "-", message: "Kirim satu object" }],
            data: null,
          });
        }

        const { values, issues } = validateBatch(body);
        if (issues.length > 0 || !values[0]) {
          return status(422, {
            success: false,
            statusCode: 422,
            message: "Validasi payload gagal",
            errors: issues,
            data: null,
          });
        }

        const updated = await updateNarsum(params.id, values[0]);
        if (!updated) {
          return status(404, {
            success: false,
            statusCode: 404,
            message: `Data dengan id ${params.id} tidak ditemukan`,
            data: null,
          });
        }

        return status(200, {
          success: true,
          statusCode: 200,
          message: "Data berhasil diperbarui",
          data: updated,
        });
      },
      {
        params: idParams,
        body: t.Any({ description: "Satu object berisi 7 field" }),
        detail: {
          summary: "Update data berdasarkan id",
          description:
            "Payload berisi 7 field (sama seperti create), berlaku sebagai penggantian penuh (full replace).",
          tags: ["Narsum (Admin)"],
          security: bearer,
        },
      },
    )

    .delete(
      "/delete/:id",
      async ({ params, status }) => {
        const deleted = await deleteNarsum(params.id);
        if (!deleted) {
          return status(404, {
            success: false,
            statusCode: 404,
            message: `Data dengan id ${params.id} tidak ditemukan`,
            data: null,
          });
        }

        return status(200, {
          success: true,
          statusCode: 200,
          message: "Data berhasil dihapus",
          data: deleted,
        });
      },
      {
        params: idParams,
        detail: {
          summary: "Hapus data berdasarkan id",
          tags: ["Narsum (Admin)"],
          security: bearer,
        },
      },
    ),
);
