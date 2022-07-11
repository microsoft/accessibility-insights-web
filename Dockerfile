# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

# reference: https://github.com/microsoft/playwright/tree/master/docs/docker
# reference: https://stackoverflow.com/a/51683309/3711475
# reference: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker

FROM mcr.microsoft.com/playwright:v1.23.2-focal AS setup

USER root

# We need to update certificates before we can successfully update and install node
# This is a workaround for https://github.com/nodesource/distributions/issues/1266
#
# We pin nodejs 16.x instead of accepting Playwright's default for consistency with
# our other build environments.
#
# dotnet-sdk-6.0 is required to build mock-adb
RUN apt-get update && \
  apt-get install -y curl apt-transport-https && \
  curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
  curl -fsSL https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -o packages-microsoft-prod.deb && \
  dpkg -i packages-microsoft-prod.deb && \
  rm packages-microsoft-prod.deb && \
  apt-get update && \
  apt-get install -y --allow-downgrades nodejs=16.* && \
  apt-get install -y dotnet-sdk-6.0 && \
  rm -rf /var/lib/apt/lists/*

RUN npm install -g yarn@1.22.10

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile

COPY . /app

FROM setup AS web
RUN yarn build:dev --no-cache

# since we need our chromium to run in 'headful' mode (for testing chrome extension)
# we need a fake display (to run headful chromium), which we create by starting a Virtualized X server environment using xvfb-run
# man page for command: https://manpages.ubuntu.com/manpages/xenial/man1/xvfb-run.1.html
ENTRYPOINT ["/bin/sh", "-c", "xvfb-run --server-args=\"-screen 0 1024x768x24\" yarn test:e2e $@", ""]

FROM setup AS unified
RUN apt-get update && \
    apt-get install -y dos2unix \
    && rm -rf /var/lib/apt/lists/*
RUN yarn playwright install-deps chromium
RUN yarn build:unified --no-cache
# because Xvfb commands must run on the container after it is built we need to use
# a bash script. these commands copy the script into the container and reformat
# the file to run in linux
ADD unified-entrypoint.sh /unified-entrypoint.sh
RUN chmod +x /unified-entrypoint.sh
RUN dos2unix /unified-entrypoint.sh
ENTRYPOINT ["/unified-entrypoint.sh"]
