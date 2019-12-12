// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IframeDetector } from 'injected/iframe-detector';
import { IMock, It, Mock, Times } from 'typemoq';

import { Message } from '../../../../../common/message';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { AnalyzerConfiguration } from '../../../../../injected/analyzers/analyzer';
import { BaseAnalyzer } from '../../../../../injected/analyzers/base-analyzer';

describe('BaseAnalyzerTest', () => {
    let testSubject: BaseAnalyzer;
    let configStub: AnalyzerConfiguration;
    let sendMessageMock: IMock<(message) => void>;
    let typeStub: VisualizationType;
    let iframeDetectorMock: IMock<IframeDetector>;

    beforeEach(() => {
        sendMessageMock = Mock.ofInstance(message => {});
        iframeDetectorMock = Mock.ofType<IframeDetector>();
        typeStub = -1 as VisualizationType;
        configStub = {
            analyzerMessageType: 'sample message type',
            key: 'sample key',
            testType: typeStub,
        };
        testSubject = new BaseAnalyzer(configStub, sendMessageMock.object, iframeDetectorMock.object);
    });

    test('analyze', async done => {
        const resultsStub = {};
        const expectedMessage: Message = {
            messageType: configStub.analyzerMessageType,
            payload: {
                key: configStub.key,
                selectorMap: resultsStub,
                scanResult: null,
                testType: typeStub,
                pageHasIframes: true,
            },
        };

        iframeDetectorMock.setup(idm => idm.hasIframes()).returns(() => true);

        sendMessageMock
            .setup(smm => smm(It.isValue(expectedMessage)))
            .callback(() => {
                sendMessageMock.verifyAll();
                done();
            })
            .verifiable(Times.once());

        testSubject.analyze();
    });
});
