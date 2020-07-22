// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { commonAdbConfigs, setupMockAdb } from '../../miscellaneous/mock-adb/setup-mock-adb';
import * as testResourceServer from '../../miscellaneous/test-resource-server/resource-server';

// tslint:disable-next-line:no-default-export
export default async function (): Promise<void> {
    testResourceServer.stopAllServers();
    await setupMockAdb(commonAdbConfigs['single-device'], 'global-setup');
}
