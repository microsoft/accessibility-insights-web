# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

# reference: https://stackoverflow.com/a/51683309/3711475
# reference: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker

# We use Puppeteer, not Cypress; however, Cypress's docker images are up to date baselines that already contain both node and
# the system dependencies required to run headful Chromium, so we use them to avoid the performance hit of having our own
# build agents running apt-get for all those dependencies.
FROM cypress/base:12.16.3

RUN npm install -g yarn@1.22.4

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile

COPY . /app

RUN yarn build:dev --no-cache

# since we need our chromium to run in 'headful' mode (for testing chrome extension)
# we need a fake display (to run headful chromium), which we create by starting a Virtualized X server environment using xvfb-run
# man page for command: https://manpages.ubuntu.com/manpages/xenial/man1/xvfb-run.1.html
ENTRYPOINT ["/bin/sh", "-c", "xvfb-run --server-args=\"-screen 0 1024x768x24\" yarn test:e2e $@", ""]
