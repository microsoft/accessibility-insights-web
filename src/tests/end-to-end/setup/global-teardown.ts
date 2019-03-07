// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as testResourceServer from './test-resource-server';

// tslint:disable-next-line:no-default-export
export default function(): void {
    testResourceServer.stopServer();
}
