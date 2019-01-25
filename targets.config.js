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
    open: iconSet('green'),
    staging: iconSet('violet'),
    daily: iconSet('red'),
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
    open: {
        release: true,
        config: {
            options: {
                ...publicOptions,
                ...icons.open,
                debug: true,
                extensionFullName: 'Accessibility Insights for Web - Open',
                telemetryBuildName: 'Open',
            },
        },
    },
    daily: {
        release: true,
        config: {
            options: {
                ...internalOptions,
                ...icons.daily,
                debug: true,
                extensionFullName: 'Accessibility Insights for Web - Daily',
                telemetryBuildName: 'Daily',
            },
        },
    },
    staging: {
        release: true,
        config: {
            options: {
                ...internalOptions,
                ...icons.staging,
                extensionFullName: 'Accessibility Insights for Web - Staging',
                telemetryBuildName: 'Staging',
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
