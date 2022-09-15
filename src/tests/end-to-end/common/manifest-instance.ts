// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface ManifestInstance {
    addTemporaryPermission(permissionToAdd: string): ManifestInstance;

    writeTo(destinationPath: string): Promise<void>;
}
