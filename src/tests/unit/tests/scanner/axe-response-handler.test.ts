// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, MockBehavior } from 'typemoq';

import { AxeResponseHandler } from '../../../../scanner/axe-response-handler';
import { ResultDecorator } from '../../../../scanner/result-decorator';

describe('AxeResponseHandler', () => {
    describe('constructor', () => {
        it('should construct the generator', () => {
            const responseHandler = new AxeResponseHandler(null, null, null);

            expect(responseHandler).not.toBeNull();
        });
    });

    describe('handleResponse: error run', () => {
        it('should call error callback with error', () => {
            const errorStub = new Error();
            const successCallbackMock = Mock.ofInstance(results => {}, MockBehavior.Strict);
            const errorCallbackMock = Mock.ofInstance(err => {}, MockBehavior.Strict);

            errorCallbackMock.setup(scb => scb(errorStub)).verifiable();

            const testSubject = new AxeResponseHandler(
                successCallbackMock.object,
                errorCallbackMock.object,
                null,
            );

            const failingFunction = () => {
                testSubject.handleResponse(errorStub, null);
            };
            expect(failingFunction).toThrowError(errorStub);

            errorCallbackMock.verifyAll();
        });
    });

    describe('handleResponse: success run', () => {
        it('should call success callback with the returned scan results stub', () => {
            const successCallbackMock = Mock.ofInstance(results => {}, MockBehavior.Strict);
            const resultDecoratorMock = Mock.ofType(ResultDecorator);
            const axeResultStub = { axeResults: true } as any;
            const scanResultsStub = { decorated: true } as any;

            resultDecoratorMock
                .setup(rdm => rdm.decorateResults(axeResultStub))
                .returns(results => scanResultsStub)
                .verifiable();

            successCallbackMock.setup(scm => scm(scanResultsStub)).verifiable();

            const testSubject = new AxeResponseHandler(
                successCallbackMock.object,
                null,
                resultDecoratorMock.object,
            );

            testSubject.handleResponse(null, axeResultStub as any);

            resultDecoratorMock.verifyAll();
        });
    });
});
