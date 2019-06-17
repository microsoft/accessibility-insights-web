// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowUtils } from './window-utils';
import { provideBlob } from './blob-provider';

export class FileURLProvider {
    constructor(private windowUtils: WindowUtils) {}

    public provideURL = (blobParts?: any[], mimeType?: string): string => {
        const blob = provideBlob(blobParts, mimeType);
        const blobURL = this.windowUtils.createObjectURL(blob);
        return blobURL;
    };
}
