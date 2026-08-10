#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DB_NAME="${TRUTRAVEL_DB_NAME:-trutravel}"
DB_USER="${TRUTRAVEL_DB_USER:-trutravel}"
DB_PASSWORD="${TRUTRAVEL_DB_PASSWORD:-trutravel}"

"${ROOT_DIR}/scripts/cloud-agent-start-postgres.sh"

# Ensure local role and database exist (safe to rerun).
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1; then
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}' CREATEDB;"
else
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER USER ${DB_USER} CREATEDB;" >/dev/null
fi
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
fi
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};" >/dev/null

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
if ! grep -q '^DATABASE_URL=' .env; then
  printf '\nDATABASE_URL="%s"\n' "$DATABASE_URL" >> .env
else
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|" .env
fi

ln -sf "${ROOT_DIR}/.env" "${ROOT_DIR}/apps/web/.env"
ln -sf "${ROOT_DIR}/.env" "${ROOT_DIR}/packages/db/.env"

npm install

npm run db:generate

# Apply schema: deploy when migrations exist; otherwise create the initial migration once.
if compgen -G "packages/db/prisma/migrations/*/migration.sql" > /dev/null; then
  npx prisma migrate deploy --schema packages/db/prisma/schema.prisma
else
  npx prisma migrate dev --name init --schema packages/db/prisma/schema.prisma --skip-seed
fi

if ! PGPASSWORD="${DB_PASSWORD}" psql -h localhost -U "${DB_USER}" -d "${DB_NAME}" -tAc \
  "SELECT 1 FROM pg_constraint WHERE conname = 'trip_trippy_no_parvati'" | grep -q 1; then
  npx prisma db execute \
    --file packages/db/prisma/sql/hard_constraints.sql \
    --schema packages/db/prisma/schema.prisma
fi

TRIP_COUNT="$(PGPASSWORD="${DB_PASSWORD}" psql -h localhost -U "${DB_USER}" -d "${DB_NAME}" -tAc 'SELECT COUNT(*) FROM "Trip"')"
if [[ "${TRIP_COUNT// /}" == "0" ]]; then
  npm run db:seed
fi
