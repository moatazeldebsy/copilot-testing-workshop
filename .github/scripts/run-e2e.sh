#!/usr/bin/env bash
# Starts the exercises app (API :4000, store UI :3006), waits for both to answer,
# then runs the Playwright suite. playwright.config.ts sets headless: false for
# participants watching locally, so CI runs it under a virtual display.
# Run it from the workshop-exercises/ directory.
set -euo pipefail

npm run dev > /tmp/workshop-dev.log 2>&1 &
DEV_PID=$!
trap 'kill "$DEV_PID" 2>/dev/null || true' EXIT

wait_for() {
  local url="$1"
  for _ in $(seq 1 60); do
    if curl -sf -o /dev/null "$url"; then
      return 0
    fi
    sleep 2
  done
  echo "Timed out waiting for $url" >&2
  cat /tmp/workshop-dev.log >&2
  return 1
}

wait_for http://127.0.0.1:4000/docs/
wait_for http://127.0.0.1:3006/

xvfb-run --auto-servernum npx playwright test
