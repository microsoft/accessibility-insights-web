// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { XMLHttpRequestFactory } from '../../../../background/xml-http-request-factory';
import { FileRequestHelper } from '../../../../common/file-request-helper';
import { Logger } from '../../../../common/logging/logger';
import { XmlHttpRequestStubBuilder } from '../../stubs/xml-http-request-stub-builder';

describe('FileRequestHelper', () => {
    let testSubject: FileRequestHelper;

    let httpRequestMock: IMock<XMLHttpRequest>;
    let xmlHttpRequestFactoryMock: IMock<XMLHttpRequestFactory>;

    beforeEach(() => {
        xmlHttpRequestFactoryMock = Mock.ofType(XMLHttpRequestFactory, MockBehavior.Strict);
        httpRequestMock = Mock.ofInstance(XmlHttpRequestStubBuilder.build(), MockBehavior.Loose);
        httpRequestMock.callBase = true;
        const loggerMock = Mock.ofType<Logger>();
        testSubject = new FileRequestHelper(xmlHttpRequestFactoryMock.object, loggerMock.object);
    });

    it("propagates the underlying request's responseText when the request succeeds", async () => {
        const fileUrl = 'file url1';
        const expectedResponseText = 'response text';

        xmlHttpRequestFactoryMock
            .setup(xF => xF.createHttpRequest())
            .returns(() => {
                return httpRequestMock.object;
            })
            .verifiable(Times.once());

        httpRequestMock.setup(x => x.open('GET', fileUrl, true)).verifiable();
        httpRequestMock.setup(x => x.send()).verifiable();

        const getFileContentPromise = testSubject.getFileContent(fileUrl);

        httpRequestMock.verifyAll();
        xmlHttpRequestFactoryMock.verifyAll();

        httpRequestMock.setup(x => x.responseText).returns(() => expectedResponseText);

        httpRequestMock.object.onload(null);

        const responseText = await getFileContentPromise;
        expect(responseText).toBe(expectedResponseText);
    });

    it('propagates error events from the underlying request as an error', async () => {
        const fileUrl = 'file url1';

        xmlHttpRequestFactoryMock
            .setup(xF => xF.createHttpRequest())
            .returns(() => {
                return httpRequestMock.object;
            })
            .verifiable(Times.once());

        httpRequestMock.setup(x => x.open('GET', fileUrl, true)).verifiable();
        httpRequestMock.setup(x => x.send()).verifiable();

        const getFileContentPromise = testSubject.getFileContent(fileUrl);

        httpRequestMock.verifyAll();
        xmlHttpRequestFactoryMock.verifyAll();

        httpRequestMock.setup(x => x.responseText).verifiable(Times.never());

        httpRequestMock.object.onerror(null);

        await expect(getFileContentPromise).rejects.toEqual(null);
        httpRequestMock.verifyAll();
    });

    test('propagates timeout events from the underlying request as an error', async () => {
        const fileUrl = 'file url1';

        xmlHttpRequestFactoryMock
            .setup(xF => xF.createHttpRequest())
            .returns(() => {
                return httpRequestMock.object;
            })
            .verifiable(Times.once());

        httpRequestMock.setup(x => x.open('GET', fileUrl, true)).verifiable();

        httpRequestMock.setup(x => x.send()).verifiable();

        const getFileContentPromise = testSubject.getFileContent(fileUrl);

        httpRequestMock.verifyAll();
        xmlHttpRequestFactoryMock.verifyAll();

        httpRequestMock.setup(x => x.responseText).verifiable(Times.never());

        httpRequestMock.object.ontimeout(null);

        await expect(getFileContentPromise).rejects.toEqual(null);
        httpRequestMock.verifyAll();
    });
});
