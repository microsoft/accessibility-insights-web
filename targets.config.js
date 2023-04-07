// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function iconSet(key) {
    return {
        icon16: `icons/brand/${key}/brand-${key}-16px.png`,
        icon48: `icons/brand/${key}/brand-${key}-48px.png`,
        icon128: `icons/brand/${key}/brand-${key}-128px.png`,
        // should have .icns, .ico, and 512x512 .png variants; generate with electron-icon-maker
        electronIconBaseName: `icons/brand/${key}/electron-icons/icon`,
    };
}

const icons = {
    dev: iconSet('gray'),
    playground: iconSet('green'),
    insider: iconSet('violet'),
    canary: iconSet('red'),
    production: iconSet('blue'),
};

const commonExtensionOptions = {
    fullName: 'Accessibility Insights for Web',
    extensionDescription:
        'Accessibility Insights for Web helps developers quickly find and fix accessibility issues.',
    bundled: true,
    productCategory: 'extension',
};

const commonUnifiedOptions = {
    fullName: 'Accessibility Insights for Android',
    bundled: true,
    productCategory: 'electron',
};

module.exports = {
    dev: {
        config: {
            options: {
                ...commonExtensionOptions,
                ...icons.dev,
                fullName: 'Accessibility Insights for Web - Dev',
                telemetryBuildName: 'Dev',
            },
        },
        bundleFolder: 'devBundle',
        mustExistFile: 'serviceWorker.bundle.js',
    },
    playground: {
        release: true,
        config: {
            options: {
                ...commonExtensionOptions,
                ...icons.playground,
                fullName: 'Accessibility Insights for Web - Playground',
                telemetryBuildName: 'Playground',
            },
        },
        bundleFolder: 'devBundle',
        mustExistFile: 'serviceWorker.bundle.js',
    },
    canary: {
        release: true,
        config: {
            options: {
                ...commonExtensionOptions,
                ...icons.canary,
                fullName: 'Accessibility Insights for Web - Canary',
                telemetryBuildName: 'Canary',
            },
        },
        bundleFolder: 'devBundle',
        mustExistFile: 'serviceWorker.bundle.js',
    },
    insider: {
        release: true,
        config: {
            options: {
                ...commonExtensionOptions,
                ...icons.insider,
                fullName: 'Accessibility Insights for Web - Insider',
                telemetryBuildName: 'Insider',
            },
        },
        bundleFolder: 'prodBundle',
        mustExistFile: 'serviceWorker.bundle.js',
    },
    production: {
        release: true,
        config: {
            options: {
                ...commonExtensionOptions,
                ...icons.production,
                telemetryBuildName: 'Production',
            },
        },
        bundleFolder: 'prodBundle',
        mustExistFile: 'serviceWorker.bundle.js',
    },
};
