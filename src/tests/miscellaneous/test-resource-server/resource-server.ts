// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as express from 'express';
import * as path from 'path';
import * as serveStatic from 'serve-static';
import { ResourceServerConfig } from 'tests/miscellaneous/test-resource-server/resource-server-config';

let server = null;

export function startServer(config: ResourceServerConfig): void {
    const app = express();

    const dirPath = path.join(__dirname, config.path);

    const serveStaticOptions = {
        extensions: config.extensions,
    };

    app.use(serveStatic(dirPath, serveStaticOptions));
    server = app.listen(config.port);
}

export function stopServer(): void {
    server.close();
}
