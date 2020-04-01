// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { ResourceServerConfig } from 'tests/miscellaneous/test-resource-server/resource-server-config';

export const testResourceServerConfig: ResourceServerConfig = {
    port: 9052,
    absolutePath: path.join(__dirname, '../../miscellaneous/mock-service-for-android'),
    extensions: ['json'],
};
