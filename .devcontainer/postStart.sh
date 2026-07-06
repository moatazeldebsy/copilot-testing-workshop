#!/usr/bin/env bash
# Runs on every container start (create + subsequent resumes/rebuilds-reuse).
#
# forwardPorts (3006, 4000) get forwarded by Codespaces/VS Code as soon as the
# container is up, regardless of whether anything is listening yet. Without
# this, the first thing a participant sees when a port auto-opens is a 502,
# because postCreateCommand only installs dependencies — it never starts the
# servers. This starts them in the background, then blocks until each one is
# actually answering before returning — postStartCommand finishing is what
# Codespaces/VS Code treats as "container ready," so if we return the instant
# the background processes are launched (before vite/tsx have finished
# binding their ports, which takes a few seconds), the ready signal and the
# first auto-forward attempt can still race the server startup and 502.
# Waiting here closes that gap instead of just narrowing it.
set -uo pipefail

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/workshop-exercises"

mkdir -p /tmp/workshop-logs

wait_for() {
  local url="$1"
  local label="$2"
  local timeout_seconds=60
  local waited=0
  until curl -sf "$url" >/dev/null 2>&1; do
    if [ "$waited" -ge "$timeout_seconds" ]; then
      echo "==> $label did not come up within ${timeout_seconds}s — check /tmp/workshop-logs for details"
      return 1
    fi
    sleep 1
    waited=$((waited + 1))
  done
  echo "==> $label is up after ${waited}s"
}

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

wait_for http://127.0.0.1:4000/api/health "API (port 4000)"
wait_for http://127.0.0.1:3006 "Store UI (port 3006)"

echo "==> Dev servers ready; logs at /tmp/workshop-logs/{api,web}.log"
