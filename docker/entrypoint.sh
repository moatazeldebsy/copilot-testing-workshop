#!/usr/bin/env bash
# Container's foreground process (docker-compose.yml's "workshop" service). Runs all three
# dev servers via the root "dev:docker" script (concurrently), so `docker compose up`'s
# terminal shows live, labeled output from all three instead of writing to log files the
# way .devcontainer/postStart.sh does for the backgrounded Codespaces case.
set -euo pipefail
cd /workspace
exec npm run dev:docker
