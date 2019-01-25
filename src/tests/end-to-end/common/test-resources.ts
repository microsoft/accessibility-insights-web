// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as testServerConfig from '../setup/test-server-config';

export function getTestResourceUrl(path: string): string {
    return `http://localhost:${testServerConfig.port}/${path}`;
}
