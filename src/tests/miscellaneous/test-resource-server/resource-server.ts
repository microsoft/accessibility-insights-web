// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import express from 'express';
import serveStatic from 'serve-static';
import { ResourceServerConfig } from 'tests/miscellaneous/test-resource-server/resource-server-config';

const serverMap = {};

export function startServer(config: ResourceServerConfig): void {
    const app = express();

    const dirPath = config.absolutePath;

    const serveStaticOptions = {
        extensions: config.extensions,
    };

    app.use(serveStatic(dirPath, serveStaticOptions));
    serverMap[config.port] = app.listen(config.port);
}

export function stopServer(config: ResourceServerConfig): void {
    serverMap[config.port].close();
    delete serverMap[config.port];
}

export function stopAllServers(): void {
    Object.keys(serverMap).forEach(port => {
        serverMap[port].close();
        delete serverMap[port];
    });
}
