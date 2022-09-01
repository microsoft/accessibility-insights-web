// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as util from 'util';
import { ManifestInstance } from 'tests/end-to-end/common/manifest-instance';

export class ManifestV2Instance implements ManifestInstance {
    private static readFile = util.promisify(fs.readFile);
    private static writeFile = util.promisify(fs.writeFile);

    public static async parse(manifestPath: string): Promise<chrome.runtime.ManifestV2> {
        const buffer = await ManifestV2Instance.readFile(manifestPath);
        const parsedManifest: chrome.runtime.ManifestV2 = JSON.parse(buffer.toString());
        return parsedManifest;
    }

    public constructor(private readonly content: chrome.runtime.ManifestV2) {}

    public addTemporaryPermission(permissionToAdd: string): ManifestV2Instance {
        if (this.content.permissions == null) {
            this.content.permissions = [];
        }
        this.content.permissions.push(permissionToAdd);

        return this;
    }

    public async writeTo(destinationPath: string): Promise<void> {
        const serializedContent = JSON.stringify(this.content, null, 2);

        await ManifestV2Instance.writeFile(destinationPath, serializedContent);
    }
}
