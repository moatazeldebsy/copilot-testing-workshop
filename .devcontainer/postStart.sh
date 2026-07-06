#!/usr/bin/env bash
# Runs on every container start (create + subsequent resumes/rebuilds-reuse).
#
# forwardPorts (3006, 4000) get forwarded by Codespaces/VS Code as soon as the
# container is up, regardless of whether anything is listening yet. Without
# this, the first thing a participant sees when a port auto-opens is a 502,
# because postCreateCommand only installs dependencies — it never starts the
# servers. This starts them unconditionally in the background, then blocks
# until each one is actually answering before returning.
#
# This intentionally does NOT try to detect "is a real server already up" via
# a curl pre-check before (re)launching — Codespaces' port-forwarding proxy
# can pre-reserve a forwarded port before anything real is listening behind
# it, which made a `curl -sf` guard here return a false positive and skip
# starting the API entirely (empty api.log, 502 on the forwarded URL, no
# error anywhere because the script correctly did nothing). Killing whatever
# holds the port and always starting fresh removes that ambiguity.
set -uo pipefail

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/workshop-exercises"

mkdir -p /tmp/workshop-logs

kill_previous() {
  local pattern="$1"
  # pkill exits non-zero when nothing matches — that's fine, ignore it.
  pkill -f "$pattern" >/dev/null 2>&1 || true
}

wait_for() {
  local url="$1"
  local label="$2"
  local timeout_seconds=60
  local waited=0
  until curl -sf --max-time 2 "$url" >/dev/null 2>&1; do
    if [ "$waited" -ge "$timeout_seconds" ]; then
      echo "==> $label did not come up within ${timeout_seconds}s — check /tmp/workshop-logs for details"
      return 1
    fi
    sleep 1
    waited=$((waited + 1))
  done
  echo "==> $label is up after ${waited}s"
}

kill_previous "tsx watch src/server.ts"
echo "==> Starting API (port 4000)"
nohup npm run dev:api >/tmp/workshop-logs/api.log 2>&1 &
disown

kill_previous "vite$"
echo "==> Starting Store UI (port 3006)"
nohup npm run dev:web >/tmp/workshop-logs/web.log 2>&1 &
disown

wait_for http://127.0.0.1:4000/api/health "API (port 4000)"
wait_for http://127.0.0.1:3006 "Store UI (port 3006)"

echo "==> Dev servers ready; logs at /tmp/workshop-logs/{api,web}.log"
