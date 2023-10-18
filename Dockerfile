# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

# reference: https://github.com/microsoft/playwright/tree/master/docs/docker
# reference: https://stackoverflow.com/a/51683309/3711475
# reference: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker

# We need to update this every time we update playwright
FROM mcr.microsoft.com/playwright:v1.39.0-focal AS setup

USER root

# We need to update certificates before we can successfully update and install node
# This is a workaround for https://github.com/nodesource/distributions/issues/1266
#
# We pin nodejs 16.x instead of accepting Playwright's default for consistency with
# our other build environments.
RUN apt-get update && \
  apt-get install ca-certificates && \
  apt-get update && \
  apt-get install -y curl && \
  curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get install -y --allow-downgrades nodejs=16.* && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY .yarn /app/.yarn
COPY yarn.lock .yarnrc.yml package.json /app/
COPY packages/axe-config/package.json /app/packages/axe-config/
COPY packages/report/package.json /app/packages/report/
COPY packages/report-e2e-tests/package.json /app/packages/report-e2e-tests/
COPY packages/ui/package.json /app/packages/ui/
COPY packages/validator/package.json /app/packages/validator/

RUN yarn install --immutable

COPY . /app

FROM setup AS web
RUN yarn build:dev --no-cache

# since we need our chromium to run in 'headful' mode (for testing chrome extension)
# we need a fake display (to run headful chromium), which we create by starting a Virtualized X server environment using xvfb-run
# man page for command: https://manpages.ubuntu.com/manpages/xenial/man1/xvfb-run.1.html
ENTRYPOINT ["/bin/sh", "-c", "xvfb-run --server-args=\"-screen 0 1024x768x24\" yarn test:e2e $@", ""]
