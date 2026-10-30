# ============================================================
#  Dockerfile — API Rekapan Narsum TSI (Bun + Elysia)
# ============================================================
FROM oven/bun:1.4-alpine

WORKDIR /app

# --- Dependency (layer terpisah agar cache efisien) ----------
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# --- Source code ---------------------------------------------
COPY . .

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

EXPOSE 3000

# Health check memakai endpoint /health
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health > /dev/null || exit 1

# Migrasi + seed bersifat idempotent, lalu jalankan server
CMD ["sh", "-c", "bun run util/migrate.ts --seed && bun index.ts"]
