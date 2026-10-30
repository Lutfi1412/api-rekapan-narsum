# API Rekapan Narsum TSI

REST API **CRUD** data rekapan narasumber (Narsum) instansi — dibangun dengan **Bun + Elysia + PostgreSQL**.

- **Login** di `POST /login` (username/password) → dapat **JWT token**. Tidak ada token statis di `.env`.
- Endpoint publik `GET /` tanpa token; endpoint admin wajib `Authorization: Bearer <token>`.
- `POST /create` menerima **satu object atau array object**, diproses paralel oleh **3 worker**.
- Tanggal disimpan sebagai `DATE` dan dikembalikan dalam format template: `8 January 2026`.
- Data awal: **99 baris** hasil seed dari `data.txt`.

---

## 1. Fitur

| Fitur | Keterangan |
| --- | --- |
| CRUD lengkap | create, read (user & admin), update, delete |
| Login JWT | `POST /login` → token HS256 ber-`exp`, verifikasi signature + kedaluwarsa |
| Kredensial di `.env` | `ADMIN_USERNAME` / `ADMIN_PASSWORD` (default `admin`/`admin`), secret `JWT_SECRET` |
| Bulk insert paralel | array diproses 3 worker (`INSERT_WORKERS`) |
| Validasi ketat | field wajib, format tanggal, tanggal selesai ≥ mulai, duplikat |
| Format tanggal fleksibel | `8 January 2026`, `2026-01-08`, `8/1/2026`, `8 Januari 2026` |
| Dokumentasi interaktif | Swagger UI `/docs` (OpenAPI JSON `/docs/json`) |
| Test otomatis | `bun test` — 23 test |
| Docker siap pakai | API + PostgreSQL 18 |
| Migrasi & seed | `sql/schema.sql` + `sql/seed.sql` (99 baris), idempotent |

### Kenapa stack ini?

- **Bun** — runtime + package manager + test runner; TypeScript jalan langsung tanpa build step.
- **Elysia** — framework HTTP cepat, validasi & dokumentasi otomatis via TypeBox.
- **Bun.SQL** — driver PostgreSQL native Bun (pool + prepared statement, tanpa dependency tambahan).
- **jose** — pembuatan/verifikasi JWT standar (HS256) yang aman dan ringan.
- **Docker Compose** — reproduksi environment (API + DB) satu perintah.

---

## 2. Struktur Folder

```text
api-rekapan-narsum-tsi/
├── config/
│   └── env.ts                     # loader + validasi environment variable
├── handler/
│   ├── auth.handler.ts            # POST /login, GET /me
│   ├── narsum.handler.ts          # route publik & admin
│   ├── narsum.service.ts          # query SQL (repository)
│   └── health.handler.ts          # GET /health
├── middleware/
│   └── auth.middleware.ts         # cek kredensial + verifikasi JWT
├── model/
│   └── narsum.model.ts            # tipe, skema, normalisasi & validasi payload
├── sql/
│   ├── schema.sql                 # DDL: tabel, constraint, index, trigger
│   └── seed.sql                   # 99 baris data (idempotent)
├── util/
│   ├── db.ts                      # pool Bun.SQL + helper
│   ├── date.ts                    # parse & format tanggal
│   ├── jwt.ts                     # sign & verify token (jose)
│   ├── pool.ts                    # worker pool (3 worker) bulk insert
│   └── migrate.ts                 # CLI migrasi & seed
├── test/
│   └── api.test.ts                # 23 test end-to-end
├── postman/
│   ├── api-rekapan-narsum-tsi.postman_collection.json
│   └── local.postman_environment.json
├── app.ts                         # instance Elysia (tanpa listen)
├── index.ts                       # entry point (listen + graceful shutdown)
├── .env / .env.example
├── Dockerfile / docker-compose.yaml / .dockerignore / .gitignore
├── package.json / tsconfig.json
└── readme.md
```

---

## 3. Prasyarat

- [Bun](https://bun.sh) **≥ 1.2** (diuji 1.4.2)
- PostgreSQL **≥ 14** (diuji PostgreSQL 18.3) — atau Docker
- (opsional) Postman untuk mencoba collection

---

## 4. Instalasi

```bash
cd "C:/Users/sawal fitah/Documents/punya lupi/HTML Project/api/api-rekapan-narsum-tsi"
bun install
cp .env.example .env      # sesuaikan db_url & JWT_SECRET
bun run db:setup          # buat tabel + seed 99 baris
```

Buat database bila belum ada:

```bash
psql -h 127.0.0.1 -U postgres -c "CREATE DATABASE rekapan_narsum_tsi"
```

### Variabel `.env`

| Variable | Wajib | Default | Keterangan |
| --- | --- | --- | --- |
| `db_url` | ⚠️ | — | `postgres://USER:PASSWORD@HOST:PORT/DB` |
| `DATABASE_URL` | — | — | Alias bila `db_url` kosong |
| `POSTGREST_URL` | — | — | Gateway HTTP PostgREST; bila diisi, `db_url` tidak wajib |
| `POSTGREST_JWT` | — | — | JWT role `web_user` untuk gateway |
| `JWT_SECRET` | ✅ | — | Secret penandatangan token |
| `JWT_EXPIRES_IN` | — | `12h` | Masa berlaku token (`30m`, `12h`, `7d`, atau detik) |
| `ADMIN_USERNAME` | — | `admin` | Username login |
| `ADMIN_PASSWORD` | — | `admin` | Password login |
| `PORT` | — | `3000` | Port HTTP |
| `HOST` | — | `0.0.0.0` | Host binding |
| `DB_POOL_MAX` | — | `10` | Maksimum koneksi pool |
| `INSERT_WORKERS` | — | `3` | Worker paralel bulk insert |
| `CORS_ORIGIN` | — | `*` | `*` atau daftar origin dipisah koma |

Di produksi (Vercel) dan `.env` lokal saat ini, koneksi memakai
`POSTGREST_URL` + `POSTGREST_JWT` (mode gateway); `db_url` hanya dipakai
bila ingin menyambung langsung ke Postgres.

Contoh `.env` mode gateway (sama dengan env di Vercel):

```dotenv
POSTGREST_URL="https://xxxx.trycloudflare.com"
POSTGREST_JWT="eyJhbGciOiJIUzI1NiIs..."
DB_POOL_MAX=3
DB_PREPARE=false
JWT_SECRET="lutfi ganteng"
JWT_EXPIRES_IN="12h"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin"
PORT=3000
HOST=0.0.0.0
CORS_ORIGIN="*"
INSERT_WORKERS=3
```

Contoh `.env` lokal dengan Postgres langsung:

```dotenv
db_url="postgres://postgres:root@127.0.0.1:5432/rekapan_narsum_tsi"
JWT_SECRET="lutfi ganteng"
JWT_EXPIRES_IN="12h"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin"
PORT=3000
INSERT_WORKERS=3
CORS_ORIGIN="*"
```

> `JWT_SECRET` boleh pendek — di `util/jwt.ts` secret diturunkan menjadi kunci 256-bit dengan SHA-256 sebelum dipakai HS256. Tetap ganti nilainya sebelum produksi.

---

## 5. Menjalankan

```bash
bun run dev      # watch mode
bun run start    # normal / produksi
```

```text
🚀 API Rekapan Narsum TSI berjalan di http://localhost:3000
📚 Dokumentasi Swagger : http://localhost:3000/docs
❤️  Health check        : http://localhost:3000/health
🔐 Login admin         : POST /login (user: admin) — token JWT berlaku 12h
🧵 Worker bulk insert  : 3
```

| Script | Fungsi |
| --- | --- |
| `bun run dev` | server + watch |
| `bun run start` | server |
| `bun run db:migrate` | tabel saja |
| `bun run db:seed` | tabel + seed |
| `bun run db:setup` | alias `db:seed` (dipakai Docker) |
| `bun run db:reset` | drop tabel, buat ulang, seed ulang (data hilang) |
| `bun test` | seluruh test |

---

## 6. Autentikasi (Login → JWT)

Tidak ada token statis. Alur:

```text
POST /login {username, password}
        │
        ▼
   token JWT (HS256, exp 12h)
        │
        ▼
Authorization: Bearer <token>  →  /admin, /create, /update/:id, /delete/:id, /me
```

### 6.1 `POST /login`

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

`200 OK`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
    "tokenType": "Bearer",
    "expiresIn": "12h",
    "expiresAt": "2026-10-29T21:21:25.000Z",
    "user": { "username": "admin", "role": "admin" }
  }
}
```

| Kondisi | Status | Body |
| --- | --- | --- |
| Kredensial benar | `200` | `data.token` |
| Password/username salah | `401` | `"Username atau password salah"` |
| `username`/`password` kosong | `422` | `errors[]` per field |

Contoh salah:

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Username atau password salah",
  "data": null
}
```

### 6.2 Memakai token

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq -r '.data.token')

curl http://localhost:3000/admin -H "Authorization: Bearer $TOKEN"
```

- Tanpa header / format salah → `401 Unauthorized: kirim header 'Authorization: Bearer <token>' ...`
- Signature rusak → `401 Unauthorized: Token tidak valid`
- Lewat `exp` → `401 Unauthorized: Token sudah kedaluwarsa, silakan login ulang`

### 6.3 `GET /me` (cek token)

```bash
curl http://localhost:3000/me -H "Authorization: Bearer $TOKEN"
```

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token valid",
  "data": {
    "username": "admin",
    "role": "admin",
    "issuedAt": "2026-10-29T09:21:25.000Z",
    "expiresAt": "2026-10-29T21:21:25.000Z"
  }
}
```

Payload JWT:

```json
{
  "sub": "admin",
  "username": "admin",
  "role": "admin",
  "iss": "api-rekapan-narsum-tsi",
  "iat": 1793000000,
  "exp": 1793043200
}
```

---

## 7. Skema Database

Tabel `rekapan_narsum`:

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | `INTEGER GENERATED ALWAYS AS IDENTITY` | Primary key |
| `nama` | `TEXT NOT NULL` | Nama narasumber |
| `instansi` | `TEXT NOT NULL` | Instansi/jabatan |
| `topik` | `TEXT NOT NULL` | Topik |
| `tanggal_mulai` | `DATE NOT NULL` | Tanggal mulai |
| `tanggal_selesai` | `DATE NOT NULL` | Tanggal selesai |
| `lokasi` | `TEXT NOT NULL` | Lokasi / "Daring" |
| `mode_pelaksanaan` | `TEXT NOT NULL` | `Online` / `Offline` / `Hybrid` |
| `created_at` | `TIMESTAMPTZ NOT NULL DEFAULT now()` | Otomatis |
| `updated_at` | `TIMESTAMPTZ NOT NULL DEFAULT now()` | Otomatis via trigger |

Constraint & index:

- `UNIQUE (nama, topik, tanggal_mulai)` → anti-duplikat, seed aman diulang.
- `CHECK (tanggal_selesai >= tanggal_mulai)`.
- Index `tanggal_mulai` dan `lower(nama)`.
- Trigger `trg_rekapan_narsum_updated_at`.

### Data seed (99 baris)

`sql/seed.sql` berisi seluruh data dari `data.txt`:

- 99 baris, tanpa duplikat (`nama + topik + tanggal_mulai` unik).
- Mode pelaksanaan: 57 `Online`, 42 `Offline`.
- Rentang tanggal: January 2026 – October 2026.
- Satu baris di sumber tertulis `5 August 0202` (salah ketik tahun) dan **dinormalkan menjadi `5 August 2026`** saat generate seed.

Contoh baris:

| id | Nama | Topik | Tanggal |
| --- | --- | --- | --- |
| 1 | Mundhi Saptono Widigdo | Knowledge Sharing Tata Kelola Penghapusan BMN | 8–10 Jan 2026 |
| 2 | Emil Agusta | Penyusunan Laporan Wasdal BMN Semester II TA 2025 | 12 Jan 2026 |
| 99 | Bayu Saputra Surya Wardhana | Penyusunan RKBMN Tahun Anggaran 2028 | 5 Oct 2026 |

Reset ulang data:

```bash
bun run db:reset     # drop + create + seed (id kembali 1..99)
```

---

## 8. Endpoint

Base URL lokal: `http://localhost:3000`

| # | Method | Path | Auth | Fungsi |
| --- | --- | --- | --- | --- |
| 1 | `POST` | `/login` | ❌ | Login admin → token |
| 2 | `GET` | `/me` | ✅ | Cek token aktif |
| 3 | `GET` | `/` | ❌ | Semua data (halaman user) |
| 4 | `GET` | `/admin` | ✅ | Semua data (dashboard admin) |
| 5 | `POST` | `/create` | ✅ | Tambah satu / banyak data |
| 6 | `PUT` | `/update/:id` | ✅ | Update data |
| 7 | `DELETE` | `/delete/:id` | ✅ | Hapus data |
| 8 | `GET` | `/health` | ❌ | Health check |
| 9 | `GET` | `/docs` | ❌ | Swagger UI |

Format item response (template):

```json
{
  "id": 1,
  "Nama": "Suratno",
  "Instansi": "Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)",
  "Topik": "Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (RKBMN)",
  "Tanggal Mulai": "4 March 2026",
  "Tanggal Selesai": "5 March 2026",
  "Lokasi": "Daring",
  "Mode Pelaksanaan": "Online"
}
```

Urutan: `Tanggal Mulai` terlama → `id`.

---

### 8.1 `GET /` — daftar data publik

```bash
curl http://localhost:3000/
```

`200 OK` → array (99 item), tanpa token.

### 8.2 `GET /admin` — daftar data admin

```bash
curl http://localhost:3000/admin -H "Authorization: Bearer $TOKEN"
```

Response array yang sama. `401` bila token tidak valid.

### 8.3 `POST /create` — tambah data

Body: satu object **atau** array object. Field per object:

| Key | Tipe | Wajib | Contoh |
| --- | --- | --- | --- |
| `Nama` | string | ✅ | `"Mundhi Saptono Widigdo"` |
| `Instansi` | string | ✅ | `"Kepala Bagian Keuangan, Kementerian Perhubungan"` |
| `Topik` | string | ✅ | `"Knowledge Sharing Tata Kelola Penghapusan BMN"` |
| `Tanggal Mulai` | string tanggal | ✅ | `"8 January 2026"` |
| `Tanggal Selesai` | string tanggal | ✅ | `"10 January 2026"` |
| `Lokasi` | string | ✅ | `"Grand Mercure Jakarta Kemayoran"` |
| `Mode Pelaksanaan` | string | ✅ | `"Offline"` |

Alias yang diterima: `nama`, `instansi`, `topik`, `tanggal_mulai`, `tanggal_selesai`, `lokasi`, `mode_pelaksanaan` (snake_case) dan `tanggalMulai` (camelCase).

```bash
curl -X POST http://localhost:3000/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "Nama": "Mundhi Saptono Widigdo",
    "Instansi": "Kepala Bagian Keuangan Direktorat Jenderal Perhubungan Laut, Kementerian Perhubungan",
    "Topik": "Knowledge Sharing Tata Kelola Penghapusan Barang Milik Negara",
    "Tanggal Mulai": "8 January 2026",
    "Tanggal Selesai": "10 January 2026",
    "Lokasi": "Grand Mercure Jakarta Kemayoran, Jl. H. Benyamin Sueb Kav. B6, Kemayoran",
    "Mode Pelaksanaan": "Offline"
  }'
```

`201 Created`

```json
{
  "success": true,
  "statusCode": 201,
  "message": "1 data berhasil disimpan",
  "total": 1,
  "inserted": 1,
  "failed": 0,
  "workers": 3,
  "data": [
    {
      "id": 100,
      "Nama": "Mundhi Saptono Widigdo",
      "Instansi": "Kepala Bagian Keuangan Direktorat Jenderal Perhubungan Laut, Kementerian Perhubungan",
      "Topik": "Knowledge Sharing Tata Kelola Penghapusan Barang Milik Negara",
      "Tanggal Mulai": "8 January 2026",
      "Tanggal Selesai": "10 January 2026",
      "Lokasi": "Grand Mercure Jakarta Kemayoran, Jl. H. Benyamin Sueb Kav. B6, Kemayoran",
      "Mode Pelaksanaan": "Offline"
    }
  ],
  "errors": []
}
```

Bulk (array):

```bash
curl -X POST http://localhost:3000/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {"Nama":"Suratno","Instansi":"Pusdiklat KP","Topik":"PJJ SIMAN (RKBMN)","Tanggal Mulai":"4 March 2026","Tanggal Selesai":"5 March 2026","Lokasi":"Daring","Mode Pelaksanaan":"Online"},
    {"Nama":"Emil Agusta","Instansi":"Pusdiklat KP","Topik":"PJJ SIMAN (Pengelolaan)","Tanggal Mulai":"9 March 2026","Tanggal Selesai":"10 March 2026","Lokasi":"Daring","Mode Pelaksanaan":"Online"},
    {"Nama":"Nurrahman Toyib","Instansi":"Pusdiklat KP","Topik":"PJJ SIMAN (BMN Idle dan Asuransi)","Tanggal Mulai":"5 March 2026","Tanggal Selesai":"6 March 2026","Lokasi":"Daring","Mode Pelaksanaan":"Online"}
  ]'
```

**Cara kerja 3 worker**

1. Semua item divalidasi dulu → satu item tidak valid = seluruh batch ditolak (`422`), tidak ada data setengah masuk.
2. Item valid masuk antrean; 3 worker mengambil item satu per satu dan `INSERT` paralel.
3. Hasil per item dilaporkan di `data` (sukses) dan `errors[]` (`index`, kode SQLSTATE, pesan).

Karena paralel, urutan `id` pada response bisa tidak berurutan — normal.

| Kondisi | Status |
| --- | --- |
| Semua berhasil | `201` |
| Sebagian gagal | `207` |
| Semua duplikat | `409` |
| Semua gagal / validasi | `422` |

### 8.4 `PUT /update/:id`

```bash
curl -X PUT http://localhost:3000/update/100 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "Nama": "Mundhi Saptono Widigdo",
    "Instansi": "Kepala Bagian Keuangan Direktorat Jenderal Perhubungan Laut, Kementerian Perhubungan",
    "Topik": "Knowledge Sharing Tata Kelola Penghapusan Barang Milik Negara",
    "Tanggal Mulai": "9 January 2026",
    "Tanggal Selesai": "11 January 2026",
    "Lokasi": "Grand Mercure Jakarta Kemayoran",
    "Mode Pelaksanaan": "Hybrid"
  }'
```

`200 OK` (full replace). `404` id tidak ada, `422` payload invalid/array, `400` `:id` bukan angka.

### 8.5 `DELETE /delete/:id`

```bash
curl -X DELETE http://localhost:3000/delete/100 -H "Authorization: Bearer $TOKEN"
```

`200 OK` + data yang dihapus, `404` bila sudah tidak ada.

### 8.6 `GET /health`

```json
{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": { "service": "api-rekapan-narsum-tsi", "database": "up", "uptime": 12, "timestamp": "..." }
}
```

`503` bila database mati.

---

## 9. Format Tanggal

| Input | Hasil |
| --- | --- |
| `8 January 2026` | ✅ `2026-01-08` |
| `2026-01-08` | ✅ |
| `8 Januari 2026` | ✅ |
| `8/1/2026`, `8-1-2026` | ✅ (DD-MM-YYYY) |
| `31 February 2026` | ❌ `422` |

Output selalu `8 January 2026`.

---

## 10. Format Error

Validasi payload → `422`:

```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validasi payload gagal",
  "errors": [
    { "index": 0, "field": "Tanggal Selesai", "message": "Tanggal Selesai wajib diisi" }
  ],
  "data": null
}
```

`index` = posisi item pada array (0-based), memudahkan frontend menandai baris salah.

---

## 11. Testing

```bash
bun test
```

```text
23 pass
0 fail
47 expect() calls
Ran 23 tests across 1 file.
```

Cakupan: login (sukses / password salah / field kurang), `/me`, token invalid & signature dirusak, 401 tanpa token, create single & bulk 3 worker, validasi field/tanggal, duplikat `409`, update `200/404`, delete `200/404`, health, route 404.

Test memakai `app.handle(new Request(...))` (tanpa port) dan langsung ke database `.env`; data uji dihapus di `afterAll`.

Cek tipe:

```bash
bunx tsc --noEmit
```

---

## 12. Dokumentasi Postman

File di `postman/`:

- `api-rekapan-narsum-tsi.postman_collection.json`
- `local.postman_environment.json`

**Cara pakai**

1. Postman → **Import** → pilih kedua file.
2. Pilih environment **API Rekapan Narsum TSI - Local**.
3. Jalankan folder **Auth → POST /login**. Script test otomatis menyimpan `data.token` ke variable `token`.
4. Semua request admin otomatis memakai `{{token}}` (Bearer).

Isi collection:

| Folder | Request | Auth |
| --- | --- | --- |
| **Auth** | `POST /login` (menyimpan token otomatis) | ❌ |
| | `POST /login - password salah` (harus 401) | ❌ |
| | `POST /login - field kosong` (harus 422) | ❌ |
| | `GET /me` | ✅ |
| **User** | `GET /` | ❌ |
| **Admin** | `GET /admin` | ✅ |
| | `GET /admin - tanpa token` (harus 401) | ❌ |
| | `POST /create - satu data` | ✅ |
| | `POST /create - bulk 3 data` | ✅ |
| | `PUT /update/:id` | ✅ |
| | `DELETE /delete/:id` | ✅ |
| **System** | `GET /health` | ❌ |
| | `GET /docs/json` | ❌ |

Variable environment: `baseUrl`, `token`, `id`. Setiap request punya `pm.test` sehingga bisa dijalankan lewat **Collection Runner** (urutan: Auth → Admin).

---

## 13. Docker

```bash
docker compose up -d --build
```

- `narsum-db` (PostgreSQL 18), host port **5433** → container `5432`.
- `narsum-api` menunggu DB sehat, jalankan migrasi + seed 99 baris, lalu server di `http://localhost:3000`.

Compose meneruskan `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`. Override:

```bash
JWT_SECRET="secret-baru" ADMIN_PASSWORD="pass-baru" docker compose up -d --build
```

```bash
docker compose logs -f api
docker compose down          # stop, data tetap
docker compose down -v       # stop + hapus volume
```

---

## 14. Deploy: DB di VPS, API di Vercel

Arsitektur yang dipakai saat ini:

```
Client  →  https://api-rekapan-narsum.vercel.app   (Elysia + Bun, region sin1)
              │  HTTPS + JWT (POSTGREST_JWT)
              ▼
        Cloudflare Quick Tunnel  (https://xxxx.trycloudflare.com)
              │  HTTP
              ▼
        PostgREST  (127.0.0.1:3001, container)
              │
              ▼
        PostgreSQL 18  (127.0.0.1:21051 → 5432, container, data 99 baris)
```

**Kenapa lewat PostgREST?** VPS hanya punya satu port publik (SSH), dan
Cloudflare Quick Tunnel hanya meneruskan HTTP/HTTPS — bukan TCP mentah.
Jadi driver `postgres` tidak bisa menyambung langsung dari Vercel.
Endpoint API tetap sama; hanya layer datanya yang memakai HTTP.

### 14.1 Sisi VPS

```bash
# folder: /home/ubuntu/rekapan-narsum-db
docker compose ps          # db + rest harus Up, db healthy
docker compose logs -f rest
```

Service systemd (jalan otomatis saat boot):

| Unit | Fungsi |
| --- | --- |
| `rekapan-narsum-db.service` | `docker compose up -d` untuk Postgres + PostgREST |
| `rekapan-narsum-tunnel.service` | Cloudflare Quick Tunnel → `127.0.0.1:3001` |

```bash
systemctl status rekapan-narsum-db.service rekapan-narsum-tunnel.service
journalctl -u rekapan-narsum-tunnel.service -n 50 | grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" | tail -1
```

Keamanan: Postgres **tidak** terbuka ke publik (bind `127.0.0.1:21051`),
PostgREST juga `127.0.0.1:3001`. Tanpa `POSTGREST_JWT` gateway menjawab
`401` karena role `web_anon` tidak diberi hak apa pun.

### 14.2 Environment di Vercel

| Variable | Isi |
| --- | --- |
| `POSTGREST_URL` | URL tunnel, mis. `https://xxxx.trycloudflare.com` |
| `POSTGREST_JWT` | JWT role `web_user` (HS256, secret = `PGRST_JWT_SECRET`) |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | secret & masa berlaku token login API |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | kredensial `POST /login` |
| `CORS_ORIGIN`, `INSERT_WORKERS` | pengaturan CORS & jumlah worker |

Bila `POSTGREST_URL` diisi, `db_url` / `DATABASE_URL` tidak wajib.

```bash
vercel env add POSTGREST_URL production preview development
vercel env add POSTGREST_JWT production preview development
vercel deploy --prod --yes
```

### 14.3 Kalau URL tunnel berubah

Quick Tunnel menghasilkan subdomain acak setiap service di-restart
(reboot VPS, `systemctl restart`). Setelah URL baru didapat:

```bash
export PGURL="https://<subdomain-baru>.trycloudflare.com"
vercel env rm POSTGREST_URL production --yes
printf '%s' "$PGURL" | vercel env add POSTGREST_URL production --force
vercel deploy --prod --yes
```

Untuk URL permanen, ganti Quick Tunnel dengan named tunnel Cloudflare
(`cloudflared tunnel create` + DNS di domain sendiri).

### 14.4 Mode lokal vs produksi

| Mode | Aktif bila | Driver |
| --- | --- | --- |
| PostgreSQL langsung | `POSTGREST_URL` kosong | `postgres.js` (TCP) |
| Gateway HTTP | `POSTGREST_URL` terisi | `fetch` ke PostgREST |

Kedua mode lolos 23 test yang sama (`bun test`).

---

## 15. Troubleshooting

| Gejala | Penyebab & solusi |
| --- | --- |
| `[ENV] Variable "db_url / DATABASE_URL" wajib diisi` | `.env` belum dibuat / `db_url` kosong |
| `[ENV] Variable "JWT_SECRET" wajib diisi` | Tambahkan `JWT_SECRET` di `.env` |
| Login selalu `401` | Kredensial tidak cocok dengan `ADMIN_USERNAME`/`ADMIN_PASSWORD` |
| `401 Unauthorized: Token tidak valid` | Token salah/terpotong, atau `JWT_SECRET` berubah → login ulang |
| `401 Unauthorized: Token sudah kedaluwarsa` | Lewat `JWT_EXPIRES_IN` → login ulang |
| `password authentication failed` | Kredensial `db_url` salah |
| `database "rekapan_narsum_tsi" does not exist` | Buat database dulu |
| `EADDRINUSE: port 3000` | Port dipakai proses lain; ubah `PORT` |
| `409` saat create | Kombinasi `Nama + Topik + Tanggal Mulai` sudah ada |
| `relation "rekapan_narsum" does not exist` | Jalankan `bun run db:setup` |
| Tanggal bergeser 1 hari | Kirim tanggal tanpa jam (kolom `DATE` murni) |
| `503` + `database: down` (mode gateway) | Tunnel mati / URL berubah → cek `rekapan-narsum-tunnel.service`, perbarui `POSTGREST_URL` |
| `401` dari gateway | `POSTGREST_JWT` kosong/kedaluwarsa atau secret beda dengan `PGRST_JWT_SECRET` |

---

## 16. Catatan Implementasi

- `app.ts` memisahkan konstruksi Elysia dari `index.ts`; test memakai `app.handle()` tanpa membuka port.
- Semua query memakai prepared statement (`$1`, `$2`, …) → aman dari SQL injection.
- Tanggal dikonversi ke teks ISO di SQL (`to_char`) agar tidak terpengaruh timezone.
- Token JWT diverifikasi signature + `exp` + `iss`; secret diturunkan 256-bit via SHA-256.
- Perbandingan username/password memakai `timingSafeEqual`.
- `INSERT_WORKERS` boleh dinaikkan (jangan melebihi `DB_POOL_MAX`).
- `POST /create` fail-fast: satu item invalid = seluruh batch ditolak.
- `util/db.ts` membuat pool secara lazy, jadi mode gateway HTTP tidak pernah membuka koneksi TCP ke database.
- `util/postgrest.ts` menerjemahkan error PostgREST (`code` Postgres, mis. `23505`) ke bentuk yang sama seperti error driver SQL.

---

## 17. Lisensi

MIT.
