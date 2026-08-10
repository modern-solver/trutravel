#!/usr/bin/env bash
set -euo pipefail

# Idempotent PostgreSQL startup for Cloud Agent VMs (systemd may be unavailable).
if pg_isready -h localhost -q 2>/dev/null; then
  exit 0
fi

if command -v service >/dev/null 2>&1; then
  sudo service postgresql start
elif command -v pg_ctlcluster >/dev/null 2>&1; then
  sudo pg_ctlcluster "$(ls /etc/postgresql | head -1)" main start
else
  echo "No supported PostgreSQL start method found." >&2
  exit 1
fi

for _ in $(seq 1 30); do
  if pg_isready -h localhost -q 2>/dev/null; then
    exit 0
  fi
  sleep 1
done

echo "PostgreSQL did not become ready within 30 seconds." >&2
exit 1
