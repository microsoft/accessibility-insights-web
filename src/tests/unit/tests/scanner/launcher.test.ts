// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

import { AxeResponseHandler } from '../../../../scanner/axe-response-handler';
import { Launcher } from '../../../../scanner/launcher';
import { ScanParamaterGenerator } from '../../../../scanner/scan-parameter-generator';

describe('Launcher', () => {
    let emptyResultsStub;
    beforeEach(() => {
        emptyResultsStub = {
            passes: [],
            violations: [],
        };
    });

    describe('runScan: with null tests to run', () => {
        it('should not have runOnly set', () => {
            const axeMock: IMock<typeof Axe> = Mock.ofInstance({
                run: (document, options, callback) => {},
            } as typeof Axe);
            const domMock = Mock.ofInstance(document);
            const axeResponeHandlerMock = Mock.ofType(AxeResponseHandler);
            const scanParamaterGeneratorMock = Mock.ofType(ScanParamaterGenerator);
            const defaultOptions = { restoreScroll: true, runOnly: undefined };
            const optionsStub = {};
            const errorMock = Mock.ofType(Error);

            scanParamaterGeneratorMock.setup(spgm => spgm.getAxeEngineOptions(optionsStub)).returns(() => defaultOptions);

            scanParamaterGeneratorMock.setup(spgm => spgm.getContext(domMock.object, optionsStub)).returns(() => domMock.object);

            axeResponeHandlerMock.setup(arhm => arhm.handleResponse(errorMock.object, emptyResultsStub)).verifiable(Times.once());

            axeMock
                .setup(axe => axe.run(domMock.object as any, defaultOptions, It.is(isFunction)))
                .callback((dom, options, callback) => callback(errorMock.object, emptyResultsStub))
                .verifiable(Times.once());

            const testObject = new Launcher(axeMock.object, scanParamaterGeneratorMock.object, domMock.object, optionsStub);
            testObject.runScan(axeResponeHandlerMock.object);

            axeResponeHandlerMock.verifyAll();
            axeMock.verifyAll();
        });
    });
});
