// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { ResourceServerConfig } from 'tests/miscellaneous/test-resource-server/resource-server-config';

export const testResourceServerConfigs: ResourceServerConfig[] = [
    // This is the "primary" resource server; most tests will refer to this one directly
    {
        port: 9050,
        absolutePath: path.join(__dirname, '../../end-to-end/test-resources'),
    },
    // This is a secondary server used for tests that require cross-origin target pages. Tests don't
    // refer to it directly; a few specific pages under /test-resources use iframes that point to
    // localhost:9053
    {
        port: 9053,
        absolutePath: path.join(__dirname, '../../end-to-end/test-resources'),
    },
];
