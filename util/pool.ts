/**
 * util/pool.ts
 * ------------------------------------------------------------------
 * Worker pool sederhana: memproses array secara paralel dengan
 * jumlah worker tetap (default 3 worker untuk POST /create).
 *
 * Tidak memakai Promise.all seluruh data supaya koneksi database
 * tidak dibanjiri saat payload berisi ratusan baris.
 */

export interface WorkerResult<T> {
  index: number;
  ok: boolean;
  value?: T;
  error?: string;
  /** Kode error PostgreSQL (mis. "23505" = unique violation). */
  code?: string;
}

export async function runWithWorkers<TInput, TOutput>(
  items: readonly TInput[],
  workerCount: number,
  worker: (item: TInput, index: number) => Promise<TOutput>,
): Promise<WorkerResult<TOutput>[]> {
  const total = items.length;
  if (total === 0) return [];

  const concurrency = Math.max(1, Math.min(Math.floor(workerCount) || 1, total));
  const results: WorkerResult<TOutput>[] = new Array(total);
  let cursor = 0;

  const runner = async (): Promise<void> => {
    while (cursor < total) {
      const index = cursor++;
      try {
        const value = await worker(items[index]!, index);
        results[index] = { index, ok: true, value };
      } catch (error) {
        const err = error as { message?: string; code?: string; errno?: string; detail?: string };
        results[index] = {
          index,
          ok: false,
          error: err?.detail ? `${err?.message ?? "Error"} — ${err.detail}` : (err?.message ?? "Unknown error"),
          // `errno` berisi SQLSTATE PostgreSQL (mis. "23505"), sedangkan
          // `code` berisi kode internal driver (ERR_POSTGRES_SERVER_ERROR).
          code: err?.errno ?? err?.code,
        };
      }
    }
  };

  await Promise.all(Array.from({ length: concurrency }, () => runner()));
  return results;
}

/** Pecah array menjadi beberapa chunk dengan ukuran tertentu. */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  const safeSize = Math.max(1, Math.floor(size));
  const output: T[][] = [];
  for (let i = 0; i < items.length; i += safeSize) {
    output.push(items.slice(i, i + safeSize) as T[]);
  }
  return output;
}
