// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, Times } from 'typemoq';
import { FileURLProvider } from '../../../common/file-url-provider';
import { WindowUtils } from '../../../common/window-utils';

describe('FileURLProviderTest', () => {
    it('provideURL', () => {
        const windowUtilsMock = Mock.ofType(WindowUtils);
        const provideBlobMock = Mock.ofType<(blobParts?: any[], mimeType?: string) => Blob>();
        const content = ['<a></a>'];
        const mimeType = 'text/html';
        const returnedURL = 'returned url';
        const blobStub = {} as Blob;

        provideBlobMock
            .setup(blobProvider => blobProvider(content, mimeType))
            .returns(() => blobStub)
            .verifiable(Times.once());

        windowUtilsMock
            .setup(windowUtil => windowUtil.createObjectURL(blobStub))
            .returns(() => returnedURL)
            .verifiable(Times.once());

        const testProvider = new FileURLProvider(windowUtilsMock.object, provideBlobMock.object);
        testProvider.provideURL(content, mimeType);

        provideBlobMock.verifyAll();
        windowUtilsMock.verifyAll();
    });
});
