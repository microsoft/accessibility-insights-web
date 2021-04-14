// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = function (grunt) {
    const webStoreAccount = {
        client_id: grunt.option('webstore-client-id'),
        client_secret: grunt.option('webstore-client-secret'),
        refresh_token: grunt.option('webstore-refresh-token'),
        publish: true,
    };

    const options = {
        appInsightsInstrumentationKey: grunt.option('app-insights-instrumentation-key'),
        electronUpdateURL: grunt.option('electron-update-url'),
        extensionVersion: grunt.option('extension-version'),
        webstoreAppId: grunt.option('webstore-app-id'),
    };

    if (!options.appInsightsInstrumentationKey) {
        grunt.fail.fatal('app-insights-instrumentation-key required to publish');
    }
    if (!grunt.option('extension-version')) {
        grunt.fail.fatal('extension-version required to publish');
    }

    grunt.initConfig({
        compress: {
            extension: {
                cwd: 'product',
                src: '**/*',
                expand: true,
                options: {
                    archive: 'extension.zip',
                },
            },
        },
        webstore_upload: {
            accounts: {
                default: webStoreAccount,
            },
            extensions: {
                open: {
                    appID: options.webstoreAppId,
                    zip: 'extension.zip',
                },
            },
            onError: e => {
                if (
                    e.errors.itemError &&
                    e.errors.itemError[0] &&
                    e.errors.itemError[0].error_code === 'ITEM_NOT_UPDATABLE'
                ) {
                    const errorExplanation =
                        'Cannot publish due to extension not being updatable. This is likely due to a previous deployment that is pending review. As such, marking this as partially successful.\n';
                    const logIssuesMessage = '##vso[task.complete result=SucceededWithIssues;]DONE';
                    const loggedMessage = errorExplanation + logIssuesMessage;
                    grunt.log.write(loggedMessage);
                } else {
                    grunt.fail.fatal(e.errorMsg);
                }
            },
            onExtensionPublished: info => {
                if (!info.success) {
                    grunt.fail.fatal(JSON.stringify(info));
                }
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-webstore-upload');

    const versionFromDate = () => makeVersionFromDateString('.');

    const makeVersionFromDateString = lastSeperator => {
        const now = new Date();
        return `${now.getUTCFullYear()}.${
            now.getUTCMonth() + 1
        }.${now.getUTCDate()}${lastSeperator}${now.getUTCHours() * 100 + now.getUTCMinutes()}`;
    };

    grunt.registerTask('update-config', function () {
        const configJSONPath = 'product/insights.config.json';
        const config = grunt.file.readJSON(configJSONPath);

        config.options.appInsightsInstrumentationKey = options.appInsightsInstrumentationKey;

        const configJSPath = 'product/insights.config.js';
        const configJSON = JSON.stringify(config, undefined, 4);
        grunt.file.write(configJSONPath, configJSON);

        const copyrightHeader =
            '// Copyright (c) Microsoft Corporation. All rights reserved.\n// Licensed under the MIT License.\n';
        const configJS = `${copyrightHeader}window.insights = ${configJSON}`;
        grunt.file.write(configJSPath, configJS);
    });

    grunt.registerTask('update-manifest', function () {
        const manifestPath = 'product/manifest.json';
        const manifest = grunt.file.readJSON(manifestPath);
        let version = options.extensionVersion;
        if (version === 'auto') {
            version = versionFromDate();
        }
        manifest.version = version;
        grunt.log.writeln(`publishing ai-web version ${version}`);
        grunt.file.write(manifestPath, JSON.stringify(manifest, undefined, 4));
    });
    grunt.registerTask('zip', ['update-config', 'update-manifest', 'compress:extension']);
    grunt.registerTask('checkWebStoreAccount', () => {
        if (!grunt.option('webstore-app-id')) {
            grunt.fail.fatal('webstore-app-id required to publish');
        }
        if (!webStoreAccount.client_id) {
            grunt.fail.fatal('webstore-client-id required to publish');
        }
        if (!webStoreAccount.client_secret) {
            grunt.fail.fatal('webstore-client-secret required to publish');
        }
        if (!webStoreAccount.refresh_token) {
            grunt.fail.fatal('webstore-refresh-token required to publish');
        }
    });
    grunt.registerTask('publish', ['zip', 'checkWebStoreAccount', 'webstore_upload:open']);

    grunt.registerTask('default', ['publish']);
};
