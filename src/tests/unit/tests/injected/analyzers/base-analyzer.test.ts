// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Message } from 'common/message';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { VisualizationType } from 'common/types/visualization-type';
import { AnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { BaseAnalyzer } from 'injected/analyzers/base-analyzer';
import { AnalyzerMessageConfiguration } from 'injected/analyzers/get-analyzer-message-types';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { IMock, It, Mock, Times } from 'typemoq';

describe('BaseAnalyzer', () => {
    let testSubject: BaseAnalyzer;
    let configStub: AnalyzerConfiguration;
    let sendMessageMock: IMock<(message) => void>;
    let typeStub: VisualizationType;
    let scanIncompleteWarningDetectorMock: IMock<ScanIncompleteWarningDetector>;
    let messageConfigurationStub: AnalyzerMessageConfiguration;

    beforeEach(() => {
        sendMessageMock = Mock.ofInstance(message => {});
        scanIncompleteWarningDetectorMock = Mock.ofType<ScanIncompleteWarningDetector>();
        typeStub = -1 as VisualizationType;
        configStub = {
            analyzerMessageType: 'sample message type',
            key: 'sample key',
            testType: typeStub,
        };
        messageConfigurationStub = {
            analyzerMessageType: 'some message type',
        };
        testSubject = new BaseAnalyzer(
            configStub,
            sendMessageMock.object,
            scanIncompleteWarningDetectorMock.object,
            failTestOnErrorLogger,
        );
    });

    test('analyze', (done: () => void) => {
        const resultsStub = {};
        const scanIncompleteWarnings: ScanIncompleteWarningId[] = [
            'missing-required-cross-origin-permissions',
        ];
        const expectedMessage: Message = {
            messageType: messageConfigurationStub.analyzerMessageType,
            payload: {
                key: configStub.key,
                selectorMap: resultsStub,
                scanResult: undefined,
                testType: typeStub,
                scanIncompleteWarnings,
            },
        };

        scanIncompleteWarningDetectorMock
            .setup(idm => idm.detectScanIncompleteWarnings())
            .returns(() => scanIncompleteWarnings);

        sendMessageMock
            .setup(smm => smm(It.isValue(expectedMessage)))
            .callback(() => {
                sendMessageMock.verifyAll();
                done();
            })
            .verifiable(Times.once());

        testSubject.analyze(messageConfigurationStub);
    });
});
