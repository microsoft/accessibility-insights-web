// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { ResourceServerConfig } from 'tests/miscellaneous/test-resource-server/resource-server-config';

export const testResourceServerConfig: ResourceServerConfig = {
    port: 9050,
    absolutePath: path.join(__dirname, '../../end-to-end/test-resources'),
};
