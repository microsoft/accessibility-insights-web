// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as util from 'util';
import { ManifestInstance } from 'tests/end-to-end/common/manifest-instance';

export class ManifestV3Instance implements ManifestInstance {
    private static readFile = util.promisify(fs.readFile);
    private static writeFile = util.promisify(fs.writeFile);

    public static async parse(manifestPath: string): Promise<chrome.runtime.ManifestV3> {
        const buffer = await ManifestV3Instance.readFile(manifestPath);
        const parsedManifest: chrome.runtime.ManifestV3 = JSON.parse(buffer.toString());
        return parsedManifest;
    }

    public constructor(private readonly content: chrome.runtime.ManifestV3) {}

    public addTemporaryPermission(permissionToAdd: string): ManifestV3Instance {
        if (this.content.host_permissions == null) {
            this.content.host_permissions = [];
        }
        this.content.host_permissions.push(permissionToAdd);

        return this;
    }

    public async writeTo(destinationPath: string): Promise<void> {
        const serializedContent = JSON.stringify(this.content, null, 3);

        await ManifestV3Instance.writeFile(destinationPath, serializedContent);
    }
}
