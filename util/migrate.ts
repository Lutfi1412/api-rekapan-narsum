/**
 * util/migrate.ts
 * ------------------------------------------------------------------
 * Script CLI untuk membuat tabel & mengisi data awal.
 *
 *   bun run util/migrate.ts            # hanya schema
 *   bun run util/migrate.ts --seed     # schema + data awal (idempotent)
 *   bun run util/migrate.ts --fresh    # hapus tabel lalu buat ulang + seed
 */

import { closeDb, countRows, runSqlFile, sql } from "./db";

const args = process.argv.slice(2);
const fresh = args.includes("--fresh");
const withSeed = args.includes("--seed") || fresh;

const schemaFile = new URL("../sql/schema.sql", import.meta.url);
const seedFile = new URL("../sql/seed.sql", import.meta.url);

try {
  if (fresh) {
    console.log("⚠️  --fresh: menghapus tabel rekapan_narsum ...");
    await sql.unsafe("DROP TABLE IF EXISTS rekapan_narsum CASCADE");
  }

  console.log("→ Menjalankan sql/schema.sql");
  await runSqlFile(schemaFile);
  console.log("✓ Schema siap");

  if (withSeed) {
    console.log("→ Menjalankan sql/seed.sql");
    await runSqlFile(seedFile);
    console.log("✓ Seed selesai (baris duplikat otomatis dilewati)");
  }

  const total = await countRows();
  console.log(`✓ Total baris tabel rekapan_narsum: ${total}`);
} catch (error) {
  console.error("✗ Migrasi gagal:", (error as Error).message);
  process.exitCode = 1;
} finally {
  await closeDb();
}
