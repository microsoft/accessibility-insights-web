// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const path = require('path');
const postcss = require('postcss');
const postCssModules = require('postcss-modules');
const sass = require('sass');

const CreateStylePlugin = isProd => {
    return {
        name: 'style-plugin',

        setup(build) {
            build.onResolve(
                {
                    filter: /^css-module:/,
                },
                args => {
                    const prefixLen = 'css-module:'.length;
                    const extNameLength = path.extname(args.path).length;
                    return {
                        path: args.path.slice(prefixLen, args.path.length - extNameLength),
                        namespace: 'css-modules',
                        pluginData: args.pluginData,
                    };
                },
            );

            /*
            esbuild only allows you to create/resolve to a single piece of output per one file
            matching the pattern/namespace combination. That is to say, after one onLoad method
            returns contents for a particular file, that file is considered resolved and esbuild
            will not continue to other onLoad methods (this includes onLoad methods in this plugin
            OR other plugins). However, for our CSS, we want to create two: (1) a CSS file compiled
            from the scss file featuring generated/hashed styles and (2) JS that connects the
            generated/hashed styles to our code.

            To do this, in our plugin's first onLoad method, we generate both the CSS and JS we need
            using postCssModules. We then return the JS content, creating (2) in this case, and
            append an import, for the styles, to our code with the 'css-module:' prefix. This prefix
            allows us to create another pattern/namespace combination for our scss. These new import
            statements will then be matched with this plugin's second onLoad method (per css-modules
            namespace), which will finally create/return (1).

            Note: the stylesheet only needs to be read once, in the first onLoad method, and can be
            passed from there to the onResolve method, and from there to the second onLoad method.
            */
            build.onLoad(
                {
                    filter: /\.s?css$/,
                },
                async args => {
                    const source = await sass.renderSync({ file: args.path }).css.toString();
                    let singleModuleCssJSON;
                    const { css } = await postcss([
                        postCssModules({
                            generateScopedName: '[local]' + (!isProd ? '--[hash:base64:5]' : ''),
                            localsConvention: 'camelCaseOnly',
                            getJSON(_, json) {
                                singleModuleCssJSON = JSON.stringify(json);
                            },
                        }),
                    ]).process(source, { from: undefined });

                    return {
                        contents: `import "css-module:${args.path}";\nexport default ${singleModuleCssJSON};`,
                        loader: 'js',
                        pluginData: css,
                    };
                },
            );

            build.onLoad(
                {
                    filter: /.*/,
                    namespace: 'css-modules',
                },
                async args => {
                    return {
                        contents: args.pluginData,
                        loader: 'css',
                    };
                },
            );
        },
    };
};

module.exports = { CreateStylePlugin };
