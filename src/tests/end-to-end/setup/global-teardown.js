// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var testResourceServer = require("./test-resource-server");

module.exports = () => {
    testResourceServer.stopServer();
};
