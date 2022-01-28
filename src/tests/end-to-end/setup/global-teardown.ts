// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import { originalManifestCopyPath } from 'tests/end-to-end/common/extension-paths';
import * as testResourceServer from '../../miscellaneous/test-resource-server/resource-server';

// tslint:disable-next-line:no-default-export
export default function (): void {
    testResourceServer.stopAllServers();

    fs.rmSync(originalManifestCopyPath);
}
