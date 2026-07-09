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

# Checks run the locally installed binary directly (./node_modules/.bin/<tool>)
# rather than via `npx --no-install <tool>`. npx falls back to its own global
# package cache (~/.npm/_npx) when the local binary is missing, which made this
# check silently pass — and skip the reinstall below — even when
# node_modules/.bin/<tool> in this project didn't exist at all.
check_bin() {
  local dir="$1" bin="$2" log="$3"
  (cd "$dir" && "./node_modules/.bin/$bin" --version) >"$log" 2>&1
}

# Docs/marketing site at the repo root.
install_dir .
if ! check_bin . vite /tmp/vite-root-check.log; then
  echo "==> vite failed to load after install in . — see /tmp/vite-root-check.log"
  clean_reinstall .
  check_bin . vite /tmp/vite-root-check.log
fi

# The actual hands-on workshop app. Also verified post-install: it ships its
# own vite@7 plus jest, and a broken/incomplete install here is exactly what
# leaves participants staring at "jest: not found" or a 502 on the forwarded
# dev server ports.
#
# playwright is checked too: it's not a direct dependency here, only
# @playwright/test is — playwright is pulled in transitively as
# @playwright/test's own dependency. A partial/interrupted npm install can
# leave @playwright/test in place while the nested playwright package is
# missing or incomplete. npm still exits 0, and the failure only surfaces
# later at runtime as "Cannot find module 'playwright/lib/program'" from
# @playwright/test/cli.js (surfaced by `playwright test` and by the VS Code
# Playwright extension's test server) — same silent-failure class as the
# vite bug above.
install_dir workshop-exercises
if ! (check_bin workshop-exercises vite /tmp/vite-workshop-check.log \
      && check_bin workshop-exercises jest /tmp/vite-workshop-check.log \
      && check_bin workshop-exercises playwright /tmp/vite-workshop-check.log); then
  echo "==> vite/jest/playwright failed to load after install in workshop-exercises — see /tmp/vite-workshop-check.log"
  clean_reinstall workshop-exercises
  check_bin workshop-exercises vite /tmp/vite-workshop-check.log
  check_bin workshop-exercises jest /tmp/vite-workshop-check.log
  check_bin workshop-exercises playwright /tmp/vite-workshop-check.log
fi

echo "==> Installing Playwright's Chromium browser for E2E exercises"
(cd workshop-exercises && npx playwright install --with-deps chromium)

echo "==> Devcontainer setup complete."
