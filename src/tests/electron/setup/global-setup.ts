// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { commonAdbConfigs, setupMockAdb } from '../../miscellaneous/mock-adb/setup-mock-adb';
import * as testResourceServer from '../../miscellaneous/test-resource-server/resource-server';
import { testResourceServerConfig } from './test-resource-server-config';

// tslint:disable-next-line:no-default-export
export default async function (): Promise<void> {
    testResourceServer.startServer(testResourceServerConfig);

    await setupMockAdb(commonAdbConfigs['single-device'], 'global-setup');
}
