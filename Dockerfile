# Local Docker alternative to Codespaces. See README.md "Run with Docker" and
# .devcontainer/postCreate.sh for the same install-verification pattern applied there —
# npm install can exit 0 even when a platform-specific native binding (e.g. vite/rolldown's
# @rolldown/binding-* optionalDependencies) fails to install, so every install below is
# followed by an explicit check that the resulting binary actually loads.
FROM node:22-bookworm
WORKDIR /workspace

# Docs/marketing site at the repo root.
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund \
    && ./node_modules/.bin/vite --version

# The hands-on workshop app: its own vite, plus jest and playwright.
COPY workshop-exercises/package.json workshop-exercises/package-lock.json workshop-exercises/
RUN cd workshop-exercises \
    && npm install --no-audit --no-fund \
    && ./node_modules/.bin/vite --version \
    && ./node_modules/.bin/jest --version \
    && ./node_modules/.bin/playwright --version

COPY . .

ENV DEBIAN_FRONTEND=noninteractive
RUN cd workshop-exercises && npx playwright install --with-deps chromium

EXPOSE 3005 3006 4000
ENTRYPOINT ["docker/entrypoint.sh"]
