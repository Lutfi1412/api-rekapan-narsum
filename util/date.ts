/**
 * util/date.ts
 * ------------------------------------------------------------------
 * Konversi tanggal dua arah:
 *   - Input  : "4 March 2026", "2026-03-04", "4/3/2026", "4 Maret 2026"
 *   - Simpan : DATE (ISO "YYYY-MM-DD") di PostgreSQL
 *   - Output : "4 March 2026" (format tampilan sesuai template)
 */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/** Nama bulan Inggris + Indonesia (dengan/tanpa singkatan). */
const MONTH_LOOKUP: Record<string, number> = {
  january: 1, jan: 1, januari: 1, januarys: 1,
  february: 2, feb: 2, februari: 2, pebruari: 2,
  march: 3, mar: 3, maret: 3,
  april: 4, apr: 4,
  may: 5, mei: 5,
  june: 6, jun: 6, juni: 6,
  july: 7, jul: 7, juli: 7,
  august: 8, aug: 8, agustus: 8, agu: 8, ags: 8,
  september: 9, sep: 9, sept: 9,
  october: 10, oct: 10, oktober: 10, okt: 10,
  november: 11, nov: 11, nopember: 11,
  december: 12, dec: 12, desember: 12, des: 12,
};

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function isValidYmd(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (year < 1900 || year > 2999) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;
  const maxDay = month === 2 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month - 1]!;
  return day <= maxDay;
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}

/** "2026-03-04" -> "4 March 2026" */
export function formatDateDisplay(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
  if (!match) return String(iso);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return `${day} ${MONTH_NAMES[month - 1] ?? ""} ${year}`.trim();
}

/** Tanggal hari ini dalam format ISO "YYYY-MM-DD" (waktu lokal). */
export function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/**
 * Parse berbagai format tanggal menjadi ISO "YYYY-MM-DD".
 * Mengembalikan `null` bila format tidak dikenali atau tanggal tidak valid.
 */
export function parseDateToIso(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const raw = input.trim();
  if (!raw) return null;

  // 1) ISO: 2026-03-04 / 2026-3-4
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    return isValidYmd(year, month, day) ? `${pad(year, 4)}-${pad(month)}-${pad(day)}` : null;
  }

  // 2) Teks bulan: "4 March 2026" / "04 Maret 2026" / "4-Mar-2026"
  const text = /^(\d{1,2})[\s.\-/]+([A-Za-z]+)[\s.\-/]+(\d{4})$/.exec(raw);
  if (text) {
    const day = Number(text[1]);
    const month = MONTH_LOOKUP[text[2]!.toLowerCase().replace(/\.$/, "")];
    const year = Number(text[3]);
    if (!month) return null;
    return isValidYmd(year, month, day) ? `${pad(year, 4)}-${pad(month)}-${pad(day)}` : null;
  }

  // 3) Angka: "4/3/2026" atau "4-3-2026" (DD-MM-YYYY, konvensi Indonesia)
  const numeric = /^(\d{1,2})[\s.\-/]+(\d{1,2})[\s.\-/]+(\d{4})$/.exec(raw);
  if (numeric) {
    const day = Number(numeric[1]);
    const month = Number(numeric[2]);
    const year = Number(numeric[3]);
    return isValidYmd(year, month, day) ? `${pad(year, 4)}-${pad(month)}-${pad(day)}` : null;
  }

  // 4) Fallback: biarkan Date() mencoba (mis. "March 4, 2026")
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = parsed.getMonth() + 1;
    const day = parsed.getDate();
    return isValidYmd(year, month, day) ? `${pad(year, 4)}-${pad(month)}-${pad(day)}` : null;
  }

  return null;
}
