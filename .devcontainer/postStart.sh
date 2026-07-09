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

# postStartCommand runs inside a short-lived `docker exec` session. `nohup
# ... & disown` alone only guards against SIGHUP — it does NOT move the
# process into its own session, so it can still be reaped along with the
# exec session's process group once postStartCommand returns. That produced
# exactly the failure seen in practice: the server printed its "listening"
# banner (proving it started and briefly bound the port, which is why
# wait_for below can even report success), then died once this script
# exited — while the identical `npm run dev:api` command run directly in a
# persistent VS Code terminal (a real, long-lived session) stayed up fine.
# `setsid` detaches the process into a brand-new session immune to that.
# `</dev/null` avoids the background process inheriting this exec session's
# stdin/pty, which is the other half of the same class of bug.
kill_previous "tsx watch src/server.ts"
echo "==> Starting API (port 4000)"
setsid nohup npm run dev:api </dev/null >/tmp/workshop-logs/api.log 2>&1 &
disown

kill_previous "vite$"
echo "==> Starting Store UI (port 3006)"
setsid nohup npm run dev:web </dev/null >/tmp/workshop-logs/web.log 2>&1 &
disown

# wait_for's exit status must actually be checked — without `set -e`
# (needed above so a slow/failed server doesn't abort the whole script before
# the other one gets a chance to start), a naive sequence of two `wait_for`
# calls followed by an unconditional "ready" echo prints success even when a
# server never came up. That's what made a broken/incomplete npm install look
# like a working setup: dev:api or dev:web crashed instantly (e.g. "vite: not
# found"), the port never answered, but the script still reported "Dev
# servers ready" with no indication anything was wrong.
api_ok=1
web_ok=1
wait_for http://127.0.0.1:4000/api/health "API (port 4000)" || api_ok=0
wait_for http://127.0.0.1:3006 "Store UI (port 3006)" || web_ok=0

if [ "$api_ok" -eq 1 ] && [ "$web_ok" -eq 1 ]; then
  echo "==> Dev servers ready; logs at /tmp/workshop-logs/{api,web}.log"
else
  echo "==> FAILED to start one or more dev servers. Logs:"
  [ "$api_ok" -eq 0 ] && { echo "--- /tmp/workshop-logs/api.log ---"; tail -n 40 /tmp/workshop-logs/api.log 2>/dev/null; }
  [ "$web_ok" -eq 0 ] && { echo "--- /tmp/workshop-logs/web.log ---"; tail -n 40 /tmp/workshop-logs/web.log 2>/dev/null; }
  echo "==> This is usually a broken node_modules install. Try:"
  echo "==>   cd workshop-exercises && rm -rf node_modules package-lock.json && npm install"
  echo "==> then re-run: bash .devcontainer/postStart.sh"
  exit 1
fi
