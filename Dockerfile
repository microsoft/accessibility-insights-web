# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.
FROM node:10

RUN apt-get update && apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps xvfb

# I am going to ignore dumb-init or such for now since it will add complexities to understand what is actually needed here.

# Assuming we are working on /app folder, cd into /app
WORKDIR /app

# Copy package.json into app folder
COPY package.json /app
COPY yarn.lock /app

# Install dependencies
RUN yarn install --frozen-lockfile

COPY . /app

# Start server on port 3000
EXPOSE 3000

# We run a fake display and run our script.
# Start script on Xvfb
CMD xvfb-run --server-args="-screen 0 1024x768x24" yarn test:e2e
