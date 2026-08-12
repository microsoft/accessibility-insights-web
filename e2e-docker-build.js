// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Wraps `docker build` for the end-to-end test image, passing its arguments through
// unchanged and adding one thing: a credential for the CFS feed.
//
// The project .yarnrc.yml points npmRegistryServer at the CFS feed, so the `yarn install`
// inside the image needs a credential for it. The Azure Artifacts npm credential provider
// writes one into the developer's home .yarnrc.yml; mounting that file as a BuildKit
// secret lets the container's yarn read it without the token ever landing in an image
// layer or in build metadata.
//
// This exists as a script rather than an inline `docker build` in package.json because the
// home directory has to be resolved portably: HOME is not set on Windows, so a literal
// $HOME in an npm script would silently produce a broken path there.
//
// Usage mirrors docker build, with the build context last:
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

if (fs.existsSync(homeYarnrc)) {
    secretArgs = ['--secret', `id=home_yarnrc,src=${homeYarnrc}`];
} else {
    console.warn(
        `No ${homeYarnrc} found, so the build has no credential for the CFS feed and ` +
            `"yarn install" will likely fail. Run the Azure Artifacts npm credential ` +
            `provider first.`,
    );
}

// docker requires the build context to be the final argument, so the secret goes in
// ahead of it rather than being appended.
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
