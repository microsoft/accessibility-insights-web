// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BlobProvider } from '../../../common/blob-provider';

describe('BlobProviderTest', () => {
    test('provideBlob', () => {
        const mimeType = 'text/html';
        const oMyBlob = BlobProvider.provideBlob(['<a></a>'], mimeType);
        expect(oMyBlob.type).toEqual(mimeType);
    });
});
