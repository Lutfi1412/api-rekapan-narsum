-- ============================================================
--  schema.sql — Struktur tabel API Rekapan Narsum TSI
--  Idempotent: aman dijalankan berulang kali.
-- ============================================================

CREATE TABLE IF NOT EXISTS rekapan_narsum (
  id                INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama              TEXT        NOT NULL,
  instansi          TEXT        NOT NULL,
  topik             TEXT        NOT NULL,
  tanggal_mulai     DATE        NOT NULL,
  tanggal_selesai   DATE        NOT NULL,
  lokasi            TEXT        NOT NULL,
  mode_pelaksanaan  TEXT        NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT rekapan_narsum_unique_row
    UNIQUE (nama, topik, tanggal_mulai),
  CONSTRAINT rekapan_narsum_mode_not_blank
    CHECK (btrim(mode_pelaksanaan) <> ''),
  CONSTRAINT rekapan_narsum_nama_not_blank
    CHECK (btrim(nama) <> ''),
  CONSTRAINT rekapan_narsum_range_valid
    CHECK (tanggal_selesai >= tanggal_mulai)
);

-- Mempercepat pengurutan/filter berdasarkan tanggal.
CREATE INDEX IF NOT EXISTS rekapan_narsum_tanggal_mulai_idx
  ON rekapan_narsum (tanggal_mulai);

CREATE INDEX IF NOT EXISTS rekapan_narsum_nama_idx
  ON rekapan_narsum (lower(nama));

-- ============================================================
--  Trigger: updated_at otomatis terisi saat UPDATE
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_rekapan_narsum_updated_at ON rekapan_narsum;
CREATE TRIGGER trg_rekapan_narsum_updated_at
  BEFORE UPDATE ON rekapan_narsum
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
