// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FileURLProvider } from '../../../common/file-url-provider';
import { WindowUtils } from '../../../common/window-utils';
import { It, Mock, Times } from 'typemoq';
import { provideBlob } from '../../../common/blob-provider';

describe('FileURLProviderTest', () => {
    it('provideURL', () => {
        const windowUtilsMock = Mock.ofType<WindowUtils>();
        const provideBlobMock = Mock.ofType<(blobParts?: any[], mimeType?: string) => Blob>();
        const blobStub = {} as Blob;
        const content = ['<a></a>'];
        const mimeType = 'text/html';
        const returnedURL = 'returned url';

        const givenBlob = provideBlob(content, mimeType);

        windowUtilsMock
            .setup(w => w.createObjectURL(givenBlob))
            .returns(() => returnedURL)
            .verifiable(Times.once());

        const testProvider = new FileURLProvider(windowUtilsMock.object);
        testProvider.provideURL(content, mimeType);

        provideBlobMock.verifyAll();
        windowUtilsMock.verifyAll();
    });
});
