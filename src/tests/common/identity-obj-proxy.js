// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Importing this module will give you an object where any "export" you attempt to use
// will take on the string value of its own name.
//
// We use this in our unit tests via a Jest moduleMapper rule that applies to all *.scss
// imports so that unit tests can run without having to build *.scss.js files first, even if
// a component uses "import styles from './self.scss';".
//
// This is an alternative implementation of the identity-obj-proxy package which is
// compatible with being used as an ESM module. We require this because swc requires
// esInterop to be enabled to support async tests. The implementation is a combination
// of a few options discussed in https://github.com/keyz/identity-obj-proxy/issues/8
const identityObjProxy = new Proxy(
    {},
    {
        get: function getter(_target, key) {
            if (key === '__esModule') {
                return true;
            }
            if (key === 'default') {
                return identityObjProxy;
            }

            return key;
        },
    },
);

module.exports = identityObjProxy;
