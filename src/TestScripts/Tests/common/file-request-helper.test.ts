// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { XMLHttpRequestFactory } from '../../../background/xml-http-request-factory';
import { FileRequestHelper } from '../../../common/file-request-helper';
import { XmlHttpRequestStubBuilder } from '../../Stubs/xml-http-request-stub-builder';

describe('FileRequestHelperTests', () => {
    let testSubject: FileRequestHelper;

    let httpRequestMock: IMock<XMLHttpRequest>;
    let xmlHttpRequestFactoryMock: IMock<XMLHttpRequestFactory>;

    beforeEach(() => {
        xmlHttpRequestFactoryMock = Mock.ofType(XMLHttpRequestFactory, MockBehavior.Strict);
        httpRequestMock = Mock.ofInstance(XmlHttpRequestStubBuilder.build(), MockBehavior.Loose);
        httpRequestMock.callBase = true;
        testSubject = new FileRequestHelper(Q, xmlHttpRequestFactoryMock.object);
    });

    test('fetch file content', async done => {
        const fileUrl = 'file url1';
        const expectedResponseText = 'response text';

        xmlHttpRequestFactoryMock
            .setup(xF => xF.createHttpRequest())
            .returns(() => {
                return httpRequestMock.object;
            })
            .verifiable(Times.once());

        httpRequestMock
            .setup(x => x.open('GET', fileUrl, true))
            .verifiable();
        httpRequestMock
            .setup(x => x.send())
            .verifiable();

        const promise = testSubject.getFileContent(fileUrl);

        httpRequestMock.verifyAll();
        xmlHttpRequestFactoryMock.verifyAll();

        expect(promise.isPending()).toBe(true);

        httpRequestMock
            .setup(x => x.responseText).returns(() => expectedResponseText);

        httpRequestMock.object.onload(null);

        promise.then(responseText => {
            expect(responseText).toBe(expectedResponseText);
            done();
        });
    });

    test('fail if request fails', async done => {
        const fileUrl = 'file url1';

        xmlHttpRequestFactoryMock
            .setup(xF => xF.createHttpRequest())
            .returns(() => {
                return httpRequestMock.object;
            })
            .verifiable(Times.once());

        httpRequestMock
            .setup(x => x.open('GET', fileUrl, true))
            .verifiable();
        httpRequestMock
            .setup(x => x.send())
            .verifiable();

        const promise = testSubject.getFileContent(fileUrl);

        httpRequestMock.verifyAll();
        xmlHttpRequestFactoryMock.verifyAll();

        expect(promise.isPending()).toBe(true);

        httpRequestMock
            .setup(x => x.responseText)
            .verifiable(Times.never());

        httpRequestMock.object.onerror(null);

        promise.then(null, error => {
            httpRequestMock.verifyAll();
            done();
        });
    });

    test('timeout if request takes more time', async done => {
        const fileUrl = 'file url1';

        xmlHttpRequestFactoryMock
            .setup(xF => xF.createHttpRequest())
            .returns(() => {
                return httpRequestMock.object;
            })
            .verifiable(Times.once());

        httpRequestMock
            .setup(x => x.open('GET', fileUrl, true))
            .verifiable();

        httpRequestMock
            .setup(x => x.send())
            .verifiable();

        const promise = testSubject.getFileContent(fileUrl);

        httpRequestMock.verifyAll();
        xmlHttpRequestFactoryMock.verifyAll();

        expect(promise.isPending()).toBe(true);

        httpRequestMock
            .setup(x => x.responseText)
            .verifiable(Times.never());

        httpRequestMock.object.ontimeout(null);

        promise.then(null, error => {
            httpRequestMock.verifyAll();
            done();
        });
    });
});
