// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var globalSetup = require("./test-resource-server");

module.exports = () => {
    globalSetup.stopServer();
}
