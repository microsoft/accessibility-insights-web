// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import {
    getExtensionPath,
    getManifestPath,
    originalManifestCopyPath,
} from 'tests/end-to-end/common/extension-paths';
import * as testResourceServer from '../../miscellaneous/test-resource-server/resource-server';
import { testResourceServerConfigs } from './test-resource-server-config';

// tslint:disable-next-line:no-default-export
export default function (): void {
    for (const testResourceServerConfig of testResourceServerConfigs) {
        testResourceServer.startServer(testResourceServerConfig);
    }

    fs.copyFileSync(getManifestPath(getExtensionPath()), originalManifestCopyPath);
}
