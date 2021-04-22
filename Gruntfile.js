// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const androidServiceBin = require('accessibility-insights-for-android-service-bin');
const yaml = require('js-yaml');
const merge = require('lodash/merge');
const sass = require('sass');
const targets = require('./targets.config');

module.exports = function (grunt) {
    const pkgPath = path.resolve('./node_modules/.bin/pkg');
    const tsmPath = path.resolve('./node_modules/.bin/tsm');
    const webpackPath = path.resolve('./node_modules/.bin/webpack');

    const extensionPath = 'extension';

    const packageReportPath = path.join('packages', 'report');
    const packageReportBundlePath = path.join(packageReportPath, 'bundle');
    const packageReportDropPath = path.join(packageReportPath, 'drop');

    const packageUIPath = path.join('packages', 'ui');
    const packageUIBundlePath = path.join(packageUIPath, 'bundle');
    const packageUIDropPath = path.join(packageUIPath, 'drop');

    const mockAdbAppPath = path.resolve('./src/tests/miscellaneous/mock-adb/app');
    const mockAdbBinSrcPath = path.join(mockAdbAppPath, 'bin.js');
    const mockAdbBinFilename = process.platform === 'win32' ? 'adb.exe' : 'adb';
    const mockAdbDropPath = path.join('drop', 'mock-adb');
    const mockAdbBinOutPath = path.join(mockAdbDropPath, mockAdbBinFilename);

    function mustExist(file, reason) {
        const normalizedFile = path.normalize(file);
        if (!grunt.file.exists(normalizedFile)) {
            grunt.fail.fatal(`Missing required file ${normalizedFile}\n${reason}`);
        }
    }

    function getUnifiedVersion() {
        return grunt.option('unified-version');
    }

    grunt.initConfig({
        bom: {
            cwd: path.resolve('./src/**/*.{ts,tsx,js,snap,html,scss,css}'),
        },
        clean: {
            intermediates: ['dist', extensionPath],
            'mock-adb': mockAdbDropPath,
            'package-report': packageReportDropPath,
            'package-ui': packageUIDropPath,
            scss: path.join('src', '**/*.scss.d.ts'),
        },
        concurrent: {
            'webpack-all': ['exec:webpack-dev', 'exec:webpack-unified', 'exec:webpack-prod'],
        },
        copy: {
            code: {
                files: [
                    {
                        cwd: './src',
                        src: ['manifest.json'],
                        dest: extensionPath,
                        expand: true,
                    },
                    {
                        cwd: './src',
                        src: ['./**/*.html', '!./tests/**/*'],
                        dest: extensionPath,
                        expand: true,
                    },
                ],
            },
            images: {
                files: [
                    {
                        cwd: './src',
                        src: ['./**/*.{png,ico,icns}', '!./tests/**/*'],
                        dest: extensionPath,
                        expand: true,
                    },
                ],
            },
            styles: {
                files: [
                    {
                        cwd: './src',
                        src: '**/*.css',
                        dest: extensionPath,
                        expand: true,
                    },
                    {
                        cwd: './dist/src/reports',
                        src: '*.css',
                        dest: path.join(extensionPath, 'reports'),
                        expand: true,
                    },
                    {
                        cwd: './dist/src/views',
                        src: '**/*.css',
                        dest: path.join(extensionPath, 'views'),
                        expand: true,
                    },
                    {
                        cwd: './dist/src/DetailsView/Styles',
                        src: '*.css',
                        dest: path.join(extensionPath, 'DetailsView/styles/default'),
                        expand: true,
                    },
                    {
                        cwd: './dist/src/electron/views',
                        src: '*.css',
                        dest: path.join(extensionPath, 'electron/views'),
                        expand: true,
                    },
                    {
                        cwd: './dist/src/injected/styles',
                        src: '*.css',
                        dest: path.join(extensionPath, 'injected/styles/default'),
                        expand: true,
                    },
                    {
                        cwd: './dist/src/popup/Styles',
                        src: '*.css',
                        dest: path.join(extensionPath, 'popup/styles/default'),
                        expand: true,
                    },
                    {
                        cwd: './node_modules/office-ui-fabric-react/dist/css',
                        src: 'fabric.min.css',
                        dest: path.join(extensionPath, 'common/styles/'),
                        expand: true,
                    },
                    {
                        cwd: './dist/src/debug-tools',
                        src: '*.css',
                        dest: path.join(extensionPath, 'debug-tools'),
                        expand: true,
                    },
                ],
            },
            'package-report': {
                files: [
                    {
                        cwd: '.',
                        src: path.join(packageReportBundlePath, 'report.bundle.js'),
                        dest: path.join(packageReportDropPath, 'index.js'),
                    },
                    {
                        cwd: '.',
                        src: './src/reports/package/accessibilityInsightsReport.d.ts',
                        dest: path.join(packageReportDropPath, 'index.d.ts'),
                    },
                ],
            },
            'package-ui': {
                files: [
                    {
                        cwd: '.',
                        src: path.join(packageUIBundlePath, 'ui.bundle.js'),
                        dest: path.join(packageUIDropPath, 'index.js'),
                    },
                    {
                        cwd: '.',
                        src: path.join(packageUIBundlePath, 'ui.css'),
                        dest: path.join(packageUIDropPath, 'ui.css'),
                    },
                    {
                        cwd: './src/packages/accessibility-insights-ui/root',
                        src: '*',
                        dest: packageUIDropPath,
                        expand: true,
                    },
                ],
            },
        },
        exec: {
            'webpack-dev': `"${webpackPath}" --config-name dev`,
            'webpack-prod': `"${webpackPath}" --config-name prod`,
            'webpack-unified': `"${webpackPath}" --config-name unified`,
            'webpack-package-report': `"${webpackPath}" --config-name package-report`,
            'webpack-package-ui': `"${webpackPath}" --config-name package-ui`,
            'generate-scss-typings': `"${tsmPath}" src`,
            'pkg-mock-adb': `"${pkgPath}" "${mockAdbBinSrcPath}" -d --target host --output "${mockAdbBinOutPath}"`,
        },
        sass: {
            options: {
                implementation: sass,
                outputStyle: 'expanded',
            },
            dist: {
                files: [
                    {
                        src: 'src/**/*.scss',
                        dest: 'dist',
                        expand: true,
                        ext: '.css',
                    },
                ],
            },
        },
        'embed-styles': {
            'package-report': {
                cwd: packageReportBundlePath,
                src: '**/*bundle.js',
                dest: packageReportBundlePath,
                expand: true,
                cssPath: path.resolve('extension', 'prodBundle'),
            },
        },
        watch: {
            images: {
                files: ['src/**/*.{png,ico,icns}'],
                tasks: ['copy:images', 'drop:dev', 'drop:unified-dev'],
            },
            'non-webpack-code': {
                files: ['src/**/*.html', 'src/manifest.json'],
                tasks: ['copy:code', 'drop:dev', 'drop:unified-dev'],
            },
            scss: {
                files: ['src/**/*.scss'],
                tasks: ['sass', 'copy:styles', 'drop:dev', 'drop:unified-dev'],
            },
            // We assume webpack --watch is running separately (usually via 'yarn watch')
            'webpack-dev-output': {
                files: ['extension/devBundle/**/*.*'],
                tasks: ['drop:dev'],
            },
            'webpack-unified-output': {
                files: ['extension/unifiedBundle/**/*.*'],
                tasks: ['drop:unified-dev'],
            },
        },
    });

    const targetNames = Object.keys(targets);
    const releaseTargets = Object.keys(targets).filter(t => targets[t].release);
    const extensionReleaseTargets = releaseTargets.filter(
        t => targets[t].config.options.productCategory === 'extension',
    );
    const unifiedReleaseTargets = releaseTargets.filter(
        t => targets[t].config.options.productCategory === 'electron',
    );

    unifiedReleaseTargets.forEach(targetName => {
        const { config, appId, publishUrl } = targets[targetName];
        const { electronIconBaseName, fullName, productCategory } = config.options;
        const dropPath = `drop/${productCategory}/${targetName}`;

        grunt.config.merge({
            'configure-electron-builder': {
                [targetName]: {
                    dropPath,
                    electronIconBaseName,
                    fullName,
                    appId,
                    publishUrl,
                },
            },
            'electron-builder-prepare': {
                [targetName]: {
                    dropPath: dropPath,
                },
            },
            'electron-builder-pack': {
                [targetName]: {
                    dropPath: dropPath,
                },
            },
            'unified-release-drop': {
                [targetName]: {
                    // empty on purpose
                },
            },
            'unified-release-pack': {
                [targetName]: {
                    // empty on purpose
                },
            },
            'zip-mac-folder': {
                [targetName]: {
                    dropPath: dropPath,
                },
            },
        });
    });

    targetNames.forEach(targetName => {
        const { config, bundleFolder, telemetryKeyIdentifier } = targets[targetName];

        const { productCategory } = config.options;

        const dropPath = path.join(`drop/${productCategory}`, targetName);
        const dropExtensionPath = path.join(dropPath, 'product');

        const productCategorySpecificCopyFiles = [];
        if (productCategory === 'electron') {
            productCategorySpecificCopyFiles.push(
                {
                    src: 'src/electron/resources/license_en.txt',
                    dest: `${dropExtensionPath}/LICENSE`,
                },
                {
                    src: androidServiceBin.apkPath,
                    // This should be kept in sync with android-service-apk.ts
                    dest: path.join(dropExtensionPath, 'android-service', 'android-service.apk'),
                },
                {
                    src: androidServiceBin.noticePath,
                    dest: path.join(
                        dropExtensionPath,
                        'android-service',
                        path.basename(androidServiceBin.noticePath),
                    ),
                },
            );
        } else {
            productCategorySpecificCopyFiles.push({
                src: 'LICENSE',
                dest: `${dropExtensionPath}/LICENSE`,
            });
        }

        grunt.config.merge({
            drop: {
                [targetName]: {
                    // empty on purpose
                },
            },
            configure: {
                [targetName]: {
                    configJSPath: path.join(dropExtensionPath, 'insights.config.js'),
                    configJSONPath: path.join(dropExtensionPath, 'insights.config.json'),
                    config,
                    telemetryKeyIdentifier,
                },
            },
            manifest: {
                [targetName]: {
                    manifestSrc: path.join('src', 'manifest.json'),
                    manifestDest: path.join(dropExtensionPath, 'manifest.json'),
                    config,
                },
            },
            clean: {
                [targetName]: dropPath,
            },
            'embed-styles': {
                [targetName]: {
                    cwd: path.resolve(extensionPath, bundleFolder),
                    src: '**/*bundle.js',
                    dest: path.resolve(extensionPath, bundleFolder),
                    cssPath: path.resolve(extensionPath, bundleFolder),
                    expand: true,
                },
            },
            copy: {
                [targetName]: {
                    files: [
                        {
                            cwd: path.resolve(extensionPath, bundleFolder),
                            src: ['*.js', '*.js.map', '*.css'],
                            dest: path.resolve(dropExtensionPath, 'bundle'),
                            expand: true,
                        },
                        {
                            cwd: extensionPath,
                            src: ['**/*.{png,icns,ico,css,woff}'],
                            dest: dropExtensionPath,
                            expand: true,
                        },
                        {
                            cwd: 'deploy',
                            src: ['Gruntfile.js', 'package.json'],
                            dest: dropPath,
                            expand: true,
                        },
                        {
                            cwd: extensionPath,
                            src: ['**/*.html'],
                            dest: dropExtensionPath,
                            expand: true,
                        },
                        ...productCategorySpecificCopyFiles,
                    ],
                },
            },
        });
    });

    grunt.loadNpmTasks('grunt-bom-removal');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerMultiTask('embed-styles', function () {
        const { cssPath } = this.data;
        this.files.forEach(file => {
            const {
                src: [src],
                dest,
            } = file;
            grunt.log.writeln(`embedding style in ${src}`);
            const fileOptions = { options: { encoding: 'utf8' } };
            const input = grunt.file.read(src, fileOptions);
            // eslint-disable-next-line no-useless-escape
            const rex = /\<\<CSS:([a-zA-Z\-\.\/]+)\>\>/g;
            const output = input.replace(rex, (_, cssName) => {
                const cssFile = path.resolve(cssPath, cssName);
                grunt.log.writeln(`    embedding from ${cssFile}`);
                const styles = grunt.file.read(cssFile, fileOptions);
                return styles.replace(/"/g, '\\"').replace(/\n/g, '\\\n');
            });
            grunt.file.write(dest, output, fileOptions);
            grunt.log.writeln(`    written to ${dest}`);
        });
    });

    grunt.registerMultiTask('configure', function () {
        const { config, configJSONPath, configJSPath, telemetryKeyIdentifier } = this.data;
        // We pass this as an option from a build variable not because it is a secret
        // (it can be found easily enough from released builds), but to make it harder
        // to accidentally pollute release telemetry with data from local builds.
        if (telemetryKeyIdentifier && grunt.option(telemetryKeyIdentifier)) {
            config.options.appInsightsInstrumentationKey = grunt.option(telemetryKeyIdentifier);
        }

        // Add unifiedAppVersion value for electron-based products
        if (config.options.productCategory === 'electron') {
            const unifiedAppVersion = getUnifiedVersion();
            if (unifiedAppVersion) {
                config.options.unifiedAppVersion = unifiedAppVersion;
            }
        }
        const configJSON = JSON.stringify(config, undefined, 4);
        grunt.file.write(configJSONPath, configJSON);
        const copyrightHeader =
            '// Copyright (c) Microsoft Corporation. All rights reserved.\n// Licensed under the MIT License.\n';
        const configJS = `${copyrightHeader}window.insights = ${configJSON}`;
        grunt.file.write(configJSPath, configJS);
    });

    grunt.registerMultiTask('manifest', function () {
        const { config, manifestSrc, manifestDest } = this.data;
        const manifestJSON = grunt.file.readJSON(manifestSrc);
        merge(manifestJSON, {
            name: config.options.fullName,
            description: config.options.extensionDescription,
            icons: {
                16: config.options.icon16,
                48: config.options.icon48,
                128: config.options.icon128,
            },
            browser_action: {
                default_icon: {
                    20: config.options.icon16,
                    40: config.options.icon48,
                },
            },
        });
        grunt.file.write(manifestDest, JSON.stringify(manifestJSON, undefined, 2));
    });

    grunt.registerMultiTask('drop', function () {
        const targetName = this.target;
        const { bundleFolder, mustExistFile, config } = targets[targetName];

        const { productCategory } = config.options;

        const dropPath = path.join(`drop/${productCategory}`, targetName);
        const dropExtensionPath = path.join(dropPath, 'product');

        const mustExistPath = path.join(extensionPath, bundleFolder, mustExistFile);

        mustExist(mustExistPath, 'Have you run webpack?');

        grunt.task.run('embed-styles:' + targetName);
        grunt.task.run('clean:' + targetName);
        grunt.task.run('copy:' + targetName);
        grunt.task.run('configure:' + targetName);
        grunt.task.run('manifest:' + targetName);
        console.log(`${targetName} extension is in ${dropExtensionPath}`);
    });

    grunt.registerMultiTask('configure-electron-builder', function () {
        grunt.task.requires('drop:' + this.target);
        const { dropPath, electronIconBaseName, fullName, appId, publishUrl } = this.data;
        const productDir = `${dropPath}/product`;

        const outElectronBuilderConfigFile = path.join(dropPath, 'electron-builder.yml');
        const srcElectronBuilderConfigFile = path.join(
            'src',
            'electron',
            'electron-builder',
            `electron-builder.template.yaml`,
        );

        const version = getUnifiedVersion() || '0.0.0';

        const config = grunt.file.readYAML(srcElectronBuilderConfigFile);
        config.appId = appId;
        config.directories.app = dropPath;
        config.directories.output = `${dropPath}/packed`;
        config.extraMetadata.version = version;
        config.win.icon = `src/${electronIconBaseName}.ico`;
        // electron-builder infers the linux icon from the mac one
        config.mac.icon = `src/${electronIconBaseName}.icns`;
        config.publish.url = publishUrl;
        config.productName = fullName;
        config.extraMetadata.name = fullName;
        // This is necessary for the AppImage to display using our brand icon
        // See electron-userland/electron-builder#3547 and AppImage/AppImageKit#678
        config.linux.artifactName = fullName.replace(/ (- )?/g, '_') + '.${ext}';

        for (const fileset of [...config.extraResources, ...config.extraFiles]) {
            fileset.from = fileset.from.replace(/TARGET_SPECIFIC_PRODUCT_DIR/g, productDir);
        }

        // Manually copying the license files is a workaround for electron-builder #1495.
        // On win/linux builds these are automatically included, but in Mac they are omitted.
        if (process.platform === 'darwin') {
            config.extraFiles.push(
                {
                    from: 'node_modules/electron/dist/LICENSE',
                    to: 'LICENSE.electron.txt',
                },
                {
                    from: 'node_modules/electron/dist/LICENSES.chromium.html',
                    to: 'LICENSES.chromium.html',
                },
            );
        }

        const configFileContent = yaml.dump(config);
        grunt.file.write(outElectronBuilderConfigFile, configFileContent);
        grunt.log.writeln(`generated ${outElectronBuilderConfigFile} from target config`);
    });

    grunt.registerMultiTask('electron-builder-prepare', function () {
        grunt.task.requires('drop:' + this.target);
        grunt.task.requires('configure-electron-builder:' + this.target);

        const { dropPath } = this.data;
        const configFile = path.join(dropPath, 'electron-builder.yml');

        const taskDoneCallback = this.async();

        grunt.util.spawn(
            {
                cmd: 'node',
                args: [
                    'node_modules/electron-builder/out/cli/cli.js',
                    '-p',
                    'never',
                    '-c',
                    configFile,
                    '--dir',
                ],
            },
            (error, result, code) => {
                if (error) {
                    grunt.fail.fatal(
                        `electron-builder exited with error code ${code}:\n\n${result.stdout}`,
                        code,
                    );
                }

                taskDoneCallback();
            },
        );
    });

    grunt.registerMultiTask('electron-builder-pack', function () {
        const { dropPath } = this.data;
        const configFile = path.join(dropPath, 'electron-builder.yml');

        mustExist(configFile, 'Have you built the product you are trying to pack?');

        let unpackedDirName;

        switch (process.platform) {
            case 'win32':
                unpackedDirName = 'win-unpacked';
                break;
            case 'darwin':
                unpackedDirName = 'mac';
                break;
            case 'linux':
                unpackedDirName = 'linux-unpacked';
                break;
        }

        const unpackedPath = path.join(dropPath, 'packed', unpackedDirName);

        const taskDoneCallback = this.async();

        grunt.util.spawn(
            {
                cmd: 'node',
                args: [
                    'node_modules/electron-builder/out/cli/cli.js',
                    '-p',
                    'never',
                    '-c',
                    configFile,
                    '--pd',
                    unpackedPath,
                ],
            },
            (error, result, code) => {
                if (error) {
                    grunt.fail.fatal(
                        `electron-builder exited with error code ${code}:\n\n${result.stdout}`,
                        code,
                    );
                }

                taskDoneCallback();
            },
        );
    });

    grunt.registerMultiTask('zip-mac-folder', function () {
        grunt.task.requires('electron-builder-pack:' + this.target);

        // We found that the mac update fails unless we produce the
        // zip file ourselves; electron-builder requires a zip file, but
        // the zip file it produces leads to 'couldn't find pkzip signatures'
        // during the eventual update.

        if (process.platform !== 'darwin') {
            grunt.log.writeln(`task not required for this platform (${process.platform})`);
            return true;
        }

        const { dropPath } = this.data;
        const packedPath = `${dropPath}/packed`;

        const taskDoneCallback = this.async();

        grunt.util.spawn(
            {
                cmd: 'node',
                args: ['pipeline/scripts/zip-mac-folder.js', packedPath],
            },
            (error, result, code) => {
                if (error) {
                    grunt.fail.fatal(
                        `zipping mac folder exited with error code ${code}:\n\n${result.stdout}`,
                        code,
                    );
                }

                taskDoneCallback();
            },
        );
    });

    grunt.registerMultiTask('unified-release-drop', function () {
        grunt.task.run(`drop:${this.target}`);
        grunt.task.run(`configure-electron-builder:${this.target}`);
        grunt.task.run(`electron-builder-prepare:${this.target}`);
    });

    grunt.registerMultiTask('unified-release-pack', function () {
        grunt.task.run(`electron-builder-pack:${this.target}`);
        grunt.task.run(`zip-mac-folder:${this.target}`);
    });

    grunt.registerTask('package-report', function () {
        const mustExistPath = path.join(packageReportBundlePath, 'report.bundle.js');

        mustExist(mustExistPath, 'Have you run webpack?');

        grunt.task.run('embed-styles:package-report');
        grunt.task.run('clean:package-report');
        grunt.task.run('copy:package-report');
        console.log(`package is in ${packageReportDropPath}`);
    });

    grunt.registerTask('package-ui', function () {
        const mustExistPath = path.join(packageUIBundlePath, 'ui.bundle.js');

        mustExist(mustExistPath, 'Have you run webpack?');

        grunt.task.run('clean:package-ui');
        grunt.task.run('copy:package-ui');
        console.log(`package is in ${packageUIDropPath}`);
    });

    grunt.registerTask('extension-release-drops', function () {
        extensionReleaseTargets.forEach(targetName => {
            grunt.task.run('drop:' + targetName);
        });
    });

    grunt.registerTask('unified-release-drops', function () {
        unifiedReleaseTargets.forEach(targetName => {
            grunt.task.run('unified-release-drop:' + targetName);
        });
    });

    grunt.registerTask('unified-release-packs', function () {
        unifiedReleaseTargets.forEach(targetName => {
            grunt.task.run('unified-release-pack:' + targetName);
        });
    });

    grunt.registerTask('ada-cat', function () {
        if (process.env.SHOW_ADA !== 'false') {
            console.log(
                'Image of Ada sleeping follows. Set environment variable SHOW_ADA to false to hide.',
            );
            const adaFile = 'docs/art/ada-cat.ansi256.txt';
            const adaArt = grunt.file.read(adaFile);
            console.log(adaArt);
        }
    });

    grunt.registerTask('build-assets', ['sass', 'copy:code', 'copy:styles', 'copy:images']);

    // Main entry points for npm scripts:
    grunt.registerTask('build-dev', [
        'clean:intermediates',
        'exec:generate-scss-typings',
        'exec:webpack-dev',
        'build-assets',
        'drop:dev',
    ]);
    grunt.registerTask('build-prod', [
        'clean:intermediates',
        'exec:generate-scss-typings',
        'exec:webpack-prod',
        'build-assets',
        'drop:production',
    ]);
    grunt.registerTask('build-unified', [
        'clean:intermediates',
        'exec:generate-scss-typings',
        'exec:pkg-mock-adb',
        'exec:webpack-unified',
        'build-assets',
        'drop:unified-dev',
    ]);
    grunt.registerTask('build-unified-canary', [
        'build-unified',
        'unified-release-drop:unified-canary',
    ]);
    grunt.registerTask('build-unified-all', ['build-unified', 'unified-release-drops']);
    grunt.registerTask('pack-unified-all', ['unified-release-packs']);
    grunt.registerTask('build-package-report', [
        'clean:intermediates',
        'exec:generate-scss-typings',
        'exec:webpack-prod', // required to get the css assets
        'exec:webpack-package-report',
        'build-assets',
        'package-report',
    ]);
    grunt.registerTask('build-package-ui', [
        'clean:intermediates',
        'exec:generate-scss-typings',
        'exec:webpack-package-ui',
        'build-assets',
        'package-ui',
    ]);
    grunt.registerTask('build-all', [
        'clean:intermediates',
        'exec:generate-scss-typings',
        'exec:pkg-mock-adb',
        'concurrent:webpack-all',
        'build-assets',
        'drop:dev',
        'drop:unified-dev',
        'extension-release-drops',
    ]);

    grunt.registerTask('default', ['build-dev']);
};
