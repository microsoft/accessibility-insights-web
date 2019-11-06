// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function iconSet(key) {
    return {
        icon16: `icons/brand/${key}/brand-${key}-16px.png`,
        icon48: `icons/brand/${key}/brand-${key}-48px.png`,
        icon128: `icons/brand/${key}/brand-${key}-128px.png`,
    };
}

const icons = {
    dev: iconSet('gray'),
    playground: iconSet('green'),
    insider: iconSet('violet'),
    canary: iconSet('red'),
    production: iconSet('blue'),
};

const commonOptions = {
    fullName: 'Accessibility Insights for Web',
    extensionDescription: 'Accessibility Insights for Web helps developers quickly find and fix accessibility issues.',
    ...icons.production,
    bundled: true,
};

const publicOptions = {
    ...commonOptions,
    requireSignInForPreviewFeatures: false,
};

const internalOptions = {
    ...commonOptions,
    requireSignInForPreviewFeatures: true,
};

module.exports = {
    dev: {
        config: {
            options: {
                ...internalOptions,
                ...icons.dev,
                fullName: 'Accessibility Insights for Web - Dev',
                telemetryBuildName: 'Dev',
                productCategory: 'extension',
            },
        },
        bundleFolder: 'devBundle',
        mustExistFile: 'background.bundle.js',
    },
    playground: {
        release: true,
        config: {
            options: {
                ...publicOptions,
                ...icons.playground,
                fullName: 'Accessibility Insights for Web - Playground',
                telemetryBuildName: 'Playground',
                productCategory: 'extension',
            },
        },
        bundleFolder: 'devBundle',
        mustExistFile: 'background.bundle.js',
    },
    canary: {
        release: true,
        config: {
            options: {
                ...internalOptions,
                ...icons.canary,
                fullName: 'Accessibility Insights for Web - Canary',
                telemetryBuildName: 'Canary',
                productCategory: 'extension',
            },
        },
        bundleFolder: 'devBundle',
        mustExistFile: 'background.bundle.js',
    },
    insider: {
        release: true,
        config: {
            options: {
                ...internalOptions,
                ...icons.insider,
                fullName: 'Accessibility Insights for Web - Insider',
                telemetryBuildName: 'Insider',
                productCategory: 'extension',
            },
        },
        bundleFolder: 'prodBundle',
        mustExistFile: 'background.bundle.js',
    },
    production: {
        release: true,
        config: {
            options: {
                ...internalOptions,
                ...icons.production,
                telemetryBuildName: 'Production',
                productCategory: 'extension',
            },
        },
        bundleFolder: 'prodBundle',
        mustExistFile: 'background.bundle.js',
    },
    electron: {
        config: {
            options: {
                ...internalOptions,
                ...icons.dev,
                fullName: 'Accessibility Insights for Android - Dev',
                telemetryBuildName: 'Android',
                productCategory: 'electron',
            },
        },
        bundleFolder: 'electronBundle',
        mustExistFile: 'main.bundle.js',
    },
};
