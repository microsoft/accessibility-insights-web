// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as express from 'express';
import * as path from 'path';
import * as serveStatic from 'serve-static';
import * as testServerConfig from './test-server-config';

let server = null;

export function startServer(): void {
    const app = express();
    app.use(serveStatic(path.join(__dirname, '../test-resources')));
    server = app.listen(testServerConfig.port);
}

export function stopServer(): void {
    server.close();
}
