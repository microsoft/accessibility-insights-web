// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';

export function getExtensionPath(): string {
    const target = process.env['WEB_E2E_TARGET'] ?? 'dev';
    return `${(global as any).rootDir}/drop/extension/${target}/product`;
}

export function getManifestPath(extensionPath: string): string {
    return `${extensionPath}/manifest.json`;
}

// In global-setup.ts we write to this path with
// a copy of the current manifest. This way each
// e2e test can work from a fresh copy of the file.
// We remove the file in global-teardown.ts.
export const originalManifestCopyPath = path.join(
    __dirname,
    '../test-resources/original-manifest-copy.json',
);
