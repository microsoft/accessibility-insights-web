// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { provideBlob } from '../../../common/blob-provider';

describe('BlobProviderTest', () => {
    test('provideBlob', () => {
        const mimeType = 'text/html';
        const oMyBlob = provideBlob(['<a></a>'], mimeType);
        expect(oMyBlob.type).toEqual(mimeType);
    });
});
