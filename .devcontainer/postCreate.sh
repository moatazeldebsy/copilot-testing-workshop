#!/usr/bin/env bash
# Runs once when the Codespace/devcontainer is created.
#
# The root docs-site project uses vite@8, which ships its rolldown bundler as
# per-platform native bindings under optionalDependencies. A known npm bug
# (https://github.com/npm/cli/issues/4828) sometimes installs the wrong/missing
# native binding for the container's platform — and critically, `npm install`
# still exits 0 when this happens. The failure only shows up later, when `vite`
# actually runs and tries to load the binding. So instead of trusting npm's exit
# code, we explicitly try `vite --version` after install and force a clean
# reinstall if that fails.
set -euo pipefail

# workspaceFolder is set to workshop-exercises/, not the repo root, so the
# working directory when this script is invoked can't be relied on. Anchor
# every relative path below to the repo root regardless of caller CWD.
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

install_dir() {
  local dir="$1"
  echo "==> Installing dependencies in $dir"
  (cd "$dir" && npm install --no-audit --no-fund)
}

clean_reinstall() {
  local dir="$1"
  echo "==> Clean reinstall in $dir (npm/cli#4828 workaround)"
  (cd "$dir" && rm -rf node_modules package-lock.json && npm install --no-audit --no-fund)
}

# Docs/marketing site at the repo root.
install_dir .
if ! (npx --no-install vite --version >/tmp/vite-root-check.log 2>&1); then
  echo "==> vite failed to load after install in . — see /tmp/vite-root-check.log"
  clean_reinstall .
  npx --no-install vite --version
fi

# The actual hands-on workshop app. Also verified post-install: it ships its
# own vite@7 plus jest, and a broken/incomplete install here is exactly what
# leaves participants staring at "jest: not found" or a 502 on the forwarded
# dev server ports.
install_dir workshop-exercises
if ! (cd workshop-exercises && npx --no-install vite --version >/tmp/vite-workshop-check.log 2>&1 \
      && npx --no-install jest --version >>/tmp/vite-workshop-check.log 2>&1); then
  echo "==> vite/jest failed to load after install in workshop-exercises — see /tmp/vite-workshop-check.log"
  clean_reinstall workshop-exercises
  (cd workshop-exercises && npx --no-install vite --version && npx --no-install jest --version)
fi

echo "==> Installing Playwright's Chromium browser for E2E exercises"
(cd workshop-exercises && npx playwright install --with-deps chromium)

echo "==> Devcontainer setup complete."
