# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

# reference: https://stackoverflow.com/a/51683309/3711475
# reference: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
FROM node:10

RUN apt-get update && apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps xvfb

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile

COPY . /app

RUN yarn build:dev

# since we need our chromium to run in 'headful' mode (for testing chrome extension)
# we need a fake display (to run headful chromium), which we create by starting a Virtualized X server environment using xvfb-run
# man page for command: https://manpages.ubuntu.com/manpages/xenial/man1/xvfb-run.1.html
ENTRYPOINT ["/bin/sh", "-c", "xvfb-run --server-args=\"-screen 0 1024x768x24\" yarn test:e2e $@", ""]
