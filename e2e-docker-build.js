// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Runs `docker build` with the developer's home .yarnrc.yml mounted as a BuildKit secret,
// so the image's `yarn install` can authenticate to the CFS feed without the token
// reaching any image layer. The Azure Artifacts npm credential provider writes that file.
//
// A script rather than an inline command because HOME is not set on Windows, so a literal
// $HOME in an npm script would silently break there. Arguments pass through to docker
// build unchanged:
//     node e2e-docker-build.js -t <image-tag> --target <stage> .

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const passthrough = process.argv.slice(2);

if (passthrough.length === 0) {
    console.error('usage: node e2e-docker-build.js <docker build args...> <context>');
    process.exit(1);
}

const homeYarnrc = path.join(os.homedir(), '.yarnrc.yml');
let secretArgs = [];

// Path comes from os.homedir() and a fixed name, so there is no injection risk here.
// eslint-disable-next-line security/detect-non-literal-fs-filename
if (fs.existsSync(homeYarnrc)) {
    secretArgs = ['--secret', `id=home_yarnrc,src=${homeYarnrc}`];
} else {
    console.warn(
        `No ${homeYarnrc} found, so the build has no credential for the CFS feed and ` +
            `"yarn install" will likely fail. Run the Azure Artifacts npm credential ` +
            `provider first.`,
    );
}

// docker requires the build context last, so the secret is spliced in before it.
const dockerArgs = ['build', ...passthrough.slice(0, -1), ...secretArgs, ...passthrough.slice(-1)];

const result = spawnSync('docker', dockerArgs, {
    stdio: 'inherit',
    env: { ...process.env, DOCKER_BUILDKIT: '1' },
    shell: process.platform === 'win32',
});

if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
