// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as util from 'util';

export class ManifestOveride {
    private static readFile = util.promisify(fs.readFile);
    private static writeFile = util.promisify(fs.writeFile);

    public static async fromManifestPath(manifestPath: string): Promise<ManifestOveride> {
        const instance = new ManifestOveride();

        const buffer = await ManifestOveride.readFile(manifestPath);

        instance.manifestPath = manifestPath;
        instance.originalManifest = buffer.toString();
        instance.modifiedManifest = JSON.parse(instance.originalManifest);

        return instance;
    }

    private manifestPath: string;
    private originalManifest: string;
    private modifiedManifest: chrome.runtime.Manifest;

    public addTemporaryPermission(permissionToAdd: string): ManifestOveride {
        if (this.modifiedManifest.permissions == null) {
            this.modifiedManifest.permissions = [];
        }
        this.modifiedManifest.permissions.push(permissionToAdd);

        return this;
    }

    public async write(): Promise<void> {
        const content = JSON.stringify(this.modifiedManifest, null, 2);

        await ManifestOveride.writeFile(this.manifestPath, content);
    }

    public restoreOriginalManifest = async (): Promise<void> =>
        await ManifestOveride.writeFile(this.manifestPath, this.originalManifest);
}
