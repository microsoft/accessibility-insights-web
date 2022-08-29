// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { commonAdbConfigs, setupMockAdb } from '../../miscellaneous/setup-mock-adb/setup-mock-adb';

// tslint:disable-next-line:no-default-export
export default async function (): Promise<void> {
    await setupMockAdb(commonAdbConfigs['single-device'], 'global-setup');
}
