// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export function provideBlob(blobParts: any[], mimeType: string): Blob {
    return new Blob(blobParts, { type: mimeType });
}
