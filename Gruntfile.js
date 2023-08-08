// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const sass = require('node-sass');
const path = require('path');
const targets = require('./targets.config');
const merge = require('lodash/merge');
const { run: copyrightCheckAndAdd } = require('license-check-and-add');

module.exports = function(grunt) {
    const extensionPath = 'extension';
    const copyrightCheckAndAddConfig = {
        folder: './',
        license: 'copyright-header.txt',
        exact_paths_method: 'EXCLUDE',
        exact_paths: [
            './.vscode',
            './.git',
            './.github',
            './dist',
            './drop',
            './extension',
            './node_modules',
            './copyright-header.txt',
            './src/assessments/color/test-steps/flashing-text-example.html',
            './test-results',
            './docs/NOTICE.html',
            './docs/LICENSE.txt',
        ],
        file_type_method: 'INCLUDE',
        file_types: ['.ts', '.tsx', '.d.ts', '.js', '.html', '.css', '.scss', '.yaml', '.md', '.txt', '.xml'],
        insert_license: false,
        license_formats: {
            'yaml|npmrc': {
                eachLine: {
                    prepend: '# ',
                },
            },
            md: {
                prepend: '<!--',
                append: '-->',
            },
            'snap|ts|tsx|d.ts|js|scss|css': {
                eachLine: {
                    prepend: '// ',
                },
            },
        },
    };

    function mustExist(file, reason) {
        const normalizedFile = path.normalize(file);
        if (!grunt.file.exists(normalizedFile)) {
            grunt.fail.fatal(`Missing required file ${normalizedFile}\n${reason}`);
        }
    }

    grunt.initConfig({
        bom: {
            cwd: path.resolve('./src/**/*.{ts,tsx,js,snap,html,scss,css}'),
        },
        clean: {
            intermediates: ['dist', extensionPath],
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
                        src: ['./**/*.png', '!./tests/**/*'],
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
                ],
            },
        },
        'embed-styles': {
            code: {
                cwd: extensionPath,
                src: '**/*bundle.js',
                dest: extensionPath,
                expand: true,
            },
        },
        exec: {
            'webpack-dev': `${path.resolve('./node_modules/.bin/webpack')} --config-name dev`,
            'webpack-prod': `${path.resolve('./node_modules/.bin/webpack')} --config-name prod`,
            'webpack-electron-main': `${path.resolve('./node_modules/.bin/webpack')} --config-name electron-main`,
            'webpack-electron-renderer': `${path.resolve('./node_modules/.bin/webpack')} --config-name electron-renderer`,
            'webpack-all': `${path.resolve('./node_modules/.bin/webpack')}`,
            'generate-scss-typings': `${path.resolve('./node_modules/.bin/tsm')} src`,
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
        watch: {
            images: {
                files: ['src/**/*.png'],
                tasks: ['copy:images', 'drop:dev'],
            },
            'non-webpack-code': {
                files: ['src/**/*.html', 'src/manifest.json'],
                tasks: ['copy:code', 'drop:dev'],
            },
            scss: {
                files: ['src/**/*.scss'],
                tasks: ['sass', 'copy:styles', 'embed-styles:code', 'drop:dev'],
            },
            // We assume webpack --watch is running separately (usually via 'yarn watch')
            'webpack-output': {
                files: ['extension/devBundle/**/*.*'],
                tasks: ['embed-styles:code', 'drop:dev'],
            },
        },
    });

    const targetNames = Object.keys(targets);
    const releaseTargets = Object.keys(targets).filter(t => targets[t].release);
    targetNames.forEach(targetName => {
        const dropPath = path.join('drop', targetName);
        const dropExtensionPath = path.join(dropPath, 'extension');

        const { config, bundleFolder } = targets[targetName];

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
                scss: path.join('src', '**/*.scss.d.ts'),
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
                            src: ['**/*.png', '**/*.css', '**/*.woff'],
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
                    ],
                },
            },
        });
    });

    grunt.loadNpmTasks('grunt-bom-removal');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('copyright-check', 'grunt task to check copyright header', function() {
        copyrightCheckAndAdd(copyrightCheckAndAddConfig);
    });

    grunt.registerTask('copyright-add', 'grunt task to add copyright header', function() {
        copyrightCheckAndAddConfig.insert_license = true;
        copyrightCheckAndAdd(copyrightCheckAndAddConfig);
    });

    grunt.registerMultiTask('embed-styles', function() {
        this.files.forEach(file => {
            const {
                src: [src],
                dest,
            } = file;
            grunt.log.writeln(`embedding style in ${src}`);
            const fileOptions = { options: { encoding: 'utf8' } };
            const input = grunt.file.read(src, fileOptions);
            const rex = /\<\<CSS:([a-zA-Z\-\.\/]+)\>\>/g;
            const output = input.replace(rex, (_, cssName) => {
                const cssFile = path.resolve('dist/src', cssName);
                grunt.log.writeln(`    embedding from ${cssFile}`);
                const styles = grunt.file.read(cssFile, fileOptions);
                return styles.replace(/\n/g, '\\\n');
            });
            grunt.file.write(dest, output, fileOptions);
            grunt.log.writeln(`    written to ${dest}`);
        });
    });

    grunt.registerMultiTask('configure', function() {
        const { config, configJSONPath, configJSPath } = this.data;
        const configJSON = JSON.stringify(config, undefined, 4);
        grunt.file.write(configJSONPath, configJSON);
        const copyrightHeader = '// Copyright (c) Microsoft Corporation. All rights reserved.\n// Licensed under the MIT License.\n';
        const configJS = `${copyrightHeader}window.insights = ${configJSON}`;
        grunt.file.write(configJSPath, configJS);
    });

    grunt.registerMultiTask('manifest', function() {
        const { config, manifestSrc, manifestDest } = this.data;
        const manifestJSON = grunt.file.readJSON(manifestSrc);
        merge(manifestJSON, {
            name: config.options.extensionFullName,
            description: config.options.extensionDescription,
            icons: {
                '16': config.options.icon16,
                '48': config.options.icon48,
                '128': config.options.icon128,
            },
            browser_action: {
                default_icon: {
                    '20': config.options.icon16,
                    '40': config.options.icon48,
                },
            },
        });
        grunt.file.write(manifestDest, JSON.stringify(manifestJSON, undefined, 2));
    });

    grunt.registerMultiTask('drop', function() {
        const targetName = this.target;
        const { bundleFolder, mustExistFile } = targets[targetName];

        const mustExistPath = path.join(extensionPath, bundleFolder, mustExistFile);

        mustExist(mustExistPath, 'Have you run webpack?');

        grunt.task.run('clean:' + targetName);
        grunt.task.run('copy:' + targetName);
        grunt.task.run('configure:' + targetName);
        grunt.task.run('manifest:' + targetName);
        console.log(`${targetName} extension is in ${path.join('drop', targetName, 'extension')}`);
    });

    grunt.registerTask('release-drops', function() {
        releaseTargets.forEach(targetName => {
            grunt.task.run('drop:' + targetName);
        });
    });

    grunt.registerTask('build-assets', ['sass', 'copy:code', 'copy:styles', 'embed-styles:code', 'copy:images']);

    // Main entry points for npm scripts:
    grunt.registerTask('build-dev', ['clean:intermediates', 'exec:generate-scss-typings', 'exec:webpack-dev', 'build-assets', 'drop:dev']);
    grunt.registerTask('build-prod', [
        'clean:intermediates',
        'exec:generate-scss-typings',
        'exec:webpack-prod',
        'build-assets',
        'drop:production',
    ]);
    grunt.registerTask('build-electron', [
        'clean:intermediates',
        'exec:generate-scss-typings',
        'exec:webpack-electron-main',
        'exec:webpack-electron-renderer',
        'build-assets',
        'drop:electron',
    ]);
    grunt.registerTask('build-all', [
        'clean:intermediates',
        'exec:generate-scss-typings',
        'exec:webpack-all',
        'build-assets',
        'drop:dev',
        'drop:electron',
        'release-drops',
    ]);

    grunt.registerTask('default', ['build-dev']);
};
