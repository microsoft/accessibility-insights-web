// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowUtils } from './window-utils';

export class FileURLProvider {
    constructor(
        private windowUtils: WindowUtils,
        private provideBlob: (blobParts: any[], mimeType: string) => Blob,
    ) {}

    public provideURL = (blobParts: any[], mimeType: string): string => {
        const blob = this.provideBlob(blobParts, mimeType);
        const blobURL = this.windowUtils.createObjectURL(blob);
        return blobURL;
    };
}
