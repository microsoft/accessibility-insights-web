// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { testResourceServerConfig } from 'tests/end-to-end/setup/test-resource-server-config';

export function getTestResourceUrl(path: string): string {
    return `http://localhost:${testResourceServerConfig.port}/${path}`;
}
