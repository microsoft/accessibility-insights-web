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
    insider: iconSet('violet'),
    canary: iconSet('red'),
    production: iconSet('blue'),
};

const commonOptions = {
    extensionFullName: 'Accessibility Insights for Web',
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
                debug: true,
                extensionFullName: 'Accessibility Insights for Web - Dev',
                telemetryBuildName: 'Dev',
            },
        },
    },
    canary: {
        release: true,
        config: {
            options: {
                ...internalOptions,
                ...icons.canary,
                debug: true,
                extensionFullName: 'Accessibility Insights for Web - Canary',
                telemetryBuildName: 'Canary',
            },
        },
    },
    insider: {
        release: true,
        config: {
            options: {
                ...internalOptions,
                ...icons.insider,
                extensionFullName: 'Accessibility Insights for Web - Insider',
                telemetryBuildName: 'Insider',
            },
        },
    },
    production: {
        release: true,
        config: {
            options: {
                ...internalOptions,
                ...icons.production,
                telemetryBuildName: 'Production',
            },
        },
    },
    preview: {
        release: true,
        config: {
            options: {
                ...publicOptions,
                ...icons.production,
                extensionFullName: 'Accessibility Insights for Web - Preview',
                telemetryBuildName: 'Preview',
            },
        },
    },
};
