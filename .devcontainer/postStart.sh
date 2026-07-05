#!/usr/bin/env bash
# Runs on every container start (create + subsequent resumes/rebuilds-reuse).
#
# forwardPorts (3006, 4000) get forwarded by Codespaces/VS Code as soon as the
# container is up, regardless of whether anything is listening yet. Without
# this, the first thing a participant sees when a port auto-opens is a 502,
# because postCreateCommand only installs dependencies — it never starts the
# servers. This starts them in the background so the ports are live shortly
# after the container reports ready.
set -uo pipefail

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/workshop-exercises"

mkdir -p /tmp/workshop-logs

if ! curl -sf http://127.0.0.1:4000/api/health >/dev/null 2>&1; then
  echo "==> Starting API (port 4000)"
  nohup npm run dev:api >/tmp/workshop-logs/api.log 2>&1 &
  disown
fi

if ! curl -sf http://127.0.0.1:3006 >/dev/null 2>&1; then
  echo "==> Starting Store UI (port 3006)"
  nohup npm run dev:web >/tmp/workshop-logs/web.log 2>&1 &
  disown
fi

echo "==> Dev servers launching in background; logs at /tmp/workshop-logs/{api,web}.log"
