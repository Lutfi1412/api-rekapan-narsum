/**
 * test/api.test.ts
 * ------------------------------------------------------------------
 * Test end-to-end memakai `app.handle()` (tanpa membuka port).
 *
 *   bun test
 *
 * Catatan:
 * - Token admin diambil dari POST /login (bukan dari .env).
 * - Test berjalan langsung ke database di .env; data uji selalu dihapus.
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { app } from "../app";
import { env } from "../config/env";
import { closeDb } from "../util/db";

const call = (path: string, init?: RequestInit) =>
  app.handle(new Request(`http://localhost${path}`, init));

const jsonHeaders = { "Content-Type": "application/json" };

let token = "";

const authHeaders = () => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

const ROW_KEYS = [
  "id",
  "Nama",
  "Instansi",
  "Topik",
  "Tanggal Mulai",
  "Tanggal Selesai",
  "Lokasi",
  "Mode Pelaksanaan",
];

const uniqueTopik = `Test otomatis ${Date.now()}`;

const validPayload = {
  Nama: "Narasumber Uji",
  Instansi: "Instansi Uji Otomatis",
  Topik: uniqueTopik,
  "Tanggal Mulai": "2 February 2026",
  "Tanggal Selesai": "3 February 2026",
  Lokasi: "Jakarta",
  "Mode Pelaksanaan": "Offline",
};

const createdIds: number[] = [];

beforeAll(async () => {
  const res = await call("/login", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD }),
  });
  const body = (await res.json()) as { data?: { token?: string } };
  token = body.data?.token ?? "";
});

afterAll(async () => {
  for (const id of createdIds) {
    await call(`/delete/${id}`, { method: "DELETE", headers: authHeaders() });
  }
  await closeDb();
});

describe("POST /login", () => {
  it("200 mengembalikan token", async () => {
    const res = await call("/login", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ username: env.ADMIN_USERNAME, password: env.ADMIN_PASSWORD }),
    });
    expect(res.status).toBe(200);

    const body = (await res.json()) as {
      success: boolean;
      data: { token: string; tokenType: string; expiresAt: string; user: { username: string } };
    };
    expect(body.success).toBe(true);
    expect(typeof body.data.token).toBe("string");
    expect(body.data.token.split(".")).toHaveLength(3);
    expect(body.data.tokenType).toBe("Bearer");
    expect(new Date(body.data.expiresAt).getTime()).toBeGreaterThan(Date.now());
    expect(body.data.user.username).toBe(env.ADMIN_USERNAME);
  });

  it("401 password salah", async () => {
    const res = await call("/login", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ username: env.ADMIN_USERNAME, password: "password-salah" }),
    });
    expect(res.status).toBe(401);
  });

  it("422 bila field tidak lengkap", async () => {
    const res = await call("/login", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ username: env.ADMIN_USERNAME }),
    });
    expect(res.status).toBe(422);
  });

  it("GET /me -> 200 dengan token valid", async () => {
    const res = await call("/me", { headers: authHeaders() });
    expect(res.status).toBe(200);

    const body = (await res.json()) as { data: { username: string; role: string } };
    expect(body.data.username).toBe(env.ADMIN_USERNAME);
    expect(body.data.role).toBe("admin");
  });

  it("GET /me -> 401 tanpa token", async () => {
    const res = await call("/me");
    expect(res.status).toBe(401);
  });
});

describe("GET / (publik)", () => {
  it("200 dan bentuk data sesuai template", async () => {
    const res = await call("/");
    expect(res.status).toBe(200);

    const body = (await res.json()) as Record<string, unknown>[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(Object.keys(body[0]!)).toEqual(ROW_KEYS);
  });
});

describe("autentikasi admin", () => {
  it("401 tanpa token", async () => {
    const res = await call("/admin");
    expect(res.status).toBe(401);
  });

  it("401 token tidak valid", async () => {
    const res = await call("/admin", { headers: { Authorization: "Bearer token-palsu" } });
    expect(res.status).toBe(401);
  });

  it("401 token kedaluwarsa", async () => {
    // Token asli tapi signature dirusak -> harus ditolak.
    const tampered = `${token.slice(0, -4)}abcd`;
    const res = await call("/admin", { headers: { Authorization: `Bearer ${tampered}` } });
    expect(res.status).toBe(401);
  });

  it("200 dengan token hasil login", async () => {
    const res = await call("/admin", { headers: authHeaders() });
    expect(res.status).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });
});

describe("POST /create", () => {
  it("201 untuk satu object", async () => {
    const res = await call("/create", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(validPayload),
    });
    expect(res.status).toBe(201);

    const body = (await res.json()) as { data: Record<string, unknown>[] };
    expect(body.data).toHaveLength(1);
    expect(body.data[0]!.Nama).toBe(validPayload.Nama);
    expect(body.data[0]!["Tanggal Mulai"]).toBe("2 February 2026");
    createdIds.push(Number(body.data[0]!.id));
  });

  it("201 untuk array (diproses 3 worker)", async () => {
    const res = await call("/create", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify([
        { ...validPayload, Nama: "Worker A", Topik: `${uniqueTopik} A` },
        { ...validPayload, Nama: "Worker B", Topik: `${uniqueTopik} B` },
        { ...validPayload, Nama: "Worker C", Topik: `${uniqueTopik} C` },
      ]),
    });
    expect(res.status).toBe(201);

    const body = (await res.json()) as {
      inserted: number;
      failed: number;
      workers: number;
      data: Record<string, unknown>[];
    };
    expect(body.inserted).toBe(3);
    expect(body.failed).toBe(0);
    expect(body.workers).toBe(3);
    for (const row of body.data) createdIds.push(Number(row.id));
  });

  it("422 saat field wajib tidak lengkap", async () => {
    const res = await call("/create", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify([{ Nama: "Tanpa Field Lain" }]),
    });
    expect(res.status).toBe(422);

    const body = (await res.json()) as { errors: { field: string }[] };
    expect(body.errors.length).toBeGreaterThan(0);
  });

  it("422 saat tanggal tidak valid", async () => {
    const res = await call("/create", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify([{ ...validPayload, "Tanggal Mulai": "31 February 2026" }]),
    });
    expect(res.status).toBe(422);
  });

  it("409 saat data duplikat", async () => {
    const res = await call("/create", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(validPayload),
    });
    expect(res.status).toBe(409);
  });

  it("401 tanpa token", async () => {
    const res = await call("/create", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(validPayload),
    });
    expect(res.status).toBe(401);
  });
});

describe("PUT /update/:id", () => {
  it("200 memperbarui data", async () => {
    const target = createdIds[0];
    expect(target).toBeDefined();

    const res = await call(`/update/${target}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({
        ...validPayload,
        Nama: "Narasumber Uji (revisi)",
        "Mode Pelaksanaan": "Online",
      }),
    });
    expect(res.status).toBe(200);

    const body = (await res.json()) as { data: Record<string, unknown> };
    expect(body.data.Nama).toBe("Narasumber Uji (revisi)");
    expect(body.data["Mode Pelaksanaan"]).toBe("Online");
  });

  it("404 untuk id yang tidak ada", async () => {
    const res = await call("/update/999999", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(validPayload),
    });
    expect(res.status).toBe(404);
  });

  it("401 tanpa token", async () => {
    const res = await call("/update/1", {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(validPayload),
    });
    expect(res.status).toBe(401);
  });
});

describe("DELETE /delete/:id", () => {
  it("200 menghapus data, lalu 404 bila diulang", async () => {
    const target = createdIds.pop();
    expect(target).toBeDefined();

    const first = await call(`/delete/${target}`, { method: "DELETE", headers: authHeaders() });
    expect(first.status).toBe(200);

    const second = await call(`/delete/${target}`, { method: "DELETE", headers: authHeaders() });
    expect(second.status).toBe(404);
  });

  it("401 tanpa token", async () => {
    const res = await call("/delete/1", { method: "DELETE" });
    expect(res.status).toBe(401);
  });
});

describe("system", () => {
  it("GET /health -> 200", async () => {
    const res = await call("/health");
    expect(res.status).toBe(200);
  });

  it("route tidak dikenal -> 404", async () => {
    const res = await call("/route-tidak-ada");
    expect(res.status).toBe(404);
  });
});
