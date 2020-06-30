// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { singleDeviceConfig } from '../../miscellaneous/mock-adb/common-adb-configs';
import { setupMockAdb } from '../../miscellaneous/mock-adb/mock-adb';
import * as testResourceServer from '../../miscellaneous/test-resource-server/resource-server';
import { testResourceServerConfig } from './test-resource-server-config';

// tslint:disable-next-line:no-default-export
export default async function (): Promise<void> {
    testResourceServer.startServer(testResourceServerConfig);

    await setupMockAdb(singleDeviceConfig);
}
