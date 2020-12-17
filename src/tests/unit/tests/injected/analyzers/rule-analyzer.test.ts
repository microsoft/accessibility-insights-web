// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScopingInputTypes } from 'background/scoping-input-types';
import { ScopingStore } from 'background/stores/global/scoping-store';
import { RuleAnalyzerScanTelemetryData } from 'common/extension-telemetry-events';
import { Message } from 'common/message';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { AxeAnalyzerResult } from 'common/types/axe-analyzer-result';
import { ScopingStoreData } from 'common/types/store-data/scoping-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { RuleAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { PostResolveCallback, RuleAnalyzer } from 'injected/analyzers/rule-analyzer';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { HtmlElementAxeResults, ScannerUtils } from 'injected/scanner-utils';
import { isFunction } from 'lodash';
import { ScanResults } from 'scanner/iruleresults';
import { ScanOptions } from 'scanner/scan-options';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

describe('RuleAnalyzer', () => {
    let scannerUtilsMock: IMock<ScannerUtils>;
    let resultProcessorMock: IMock<
        (results: ScanResults) => DictionaryStringTo<HtmlElementAxeResults>
    >;
    let dateGetterMock: IMock<() => Date>;
    let dateMock: IMock<Date>;
    let scopingStoreMock: IMock<ScopingStore>;
    let scopingState: ScopingStoreData;
    const allInstancesMock: DictionaryStringTo<any> = {
        test: 'test-result-value',
    };
    let sendMessageMock: IMock<(message) => void>;
    let telemetryDataFactoryMock: IMock<TelemetryDataFactory>;
    let typeStub: VisualizationType;
    let configStub: RuleAnalyzerConfiguration;
    let scanCallback: (results: ScanResults) => void;
    let postResolveCallbackMock: IMock<PostResolveCallback>;
    let scanIncompleteWarningDetectorMock: IMock<ScanIncompleteWarningDetector>;

    beforeEach(() => {
        typeStub = -1 as VisualizationType;
        sendMessageMock = Mock.ofInstance(message => {});
        resultProcessorMock = Mock.ofInstance(results => null);
        scannerUtilsMock = Mock.ofType(ScannerUtils);
        scopingStoreMock = Mock.ofType(ScopingStore);
        telemetryDataFactoryMock = Mock.ofType(TelemetryDataFactory);
        postResolveCallbackMock = Mock.ofInstance(results => null);

        const dateStub = {
            getTime: () => {
                return null;
            },
        };
        dateMock = Mock.ofInstance(dateStub as Date);
        dateGetterMock = Mock.ofInstance(() => null);
        scanIncompleteWarningDetectorMock = Mock.ofType<ScanIncompleteWarningDetector>();
        dateGetterMock.setup(dgm => dgm()).returns(() => dateMock.object);
        scopingState = {
            selectors: {
                [ScopingInputTypes.include]: [['fake include selector']],
                [ScopingInputTypes.exclude]: [['fake exclude selector']],
            },
        };
        scopingStoreMock
            .setup(sm => sm.getState())
            .returns(() => scopingState)
            .verifiable();
        scanIncompleteWarningDetectorMock
            .setup(idm => idm.detectScanIncompleteWarnings())
            .returns(() => []);
    });

    test('analyze', (done: () => void) => {
        testGetResults(done);
    });

    function createTelemetryStub(
        elapsedTime: number,
        testName: string,
        requirementName: string,
    ): RuleAnalyzerScanTelemetryData {
        const telemetryStub: RuleAnalyzerScanTelemetryData = {
            scanDuration: elapsedTime,
            NumberOfElementsScanned: 2,
            include: [],
            exclude: [],
            testName,
            requirementName,
        };
        return telemetryStub;
    }

    function testGetResults(done: () => void): void {
        const key = 'sample key';
        const testName = 'sample test name';
        const telemetryProcessorStub = factory => (_, elapsedTime, __) => {
            return createTelemetryStub(elapsedTime, testName, key);
        };
        const startTime = 10;
        const endTime = 20;
        const expectedTelemetryStub = createTelemetryStub(endTime - startTime, testName, key);

        configStub = {
            rules: ['fake-rule'],
            analyzerMessageType: 'sample message type',
            key,
            testType: typeStub,
            telemetryProcessor: telemetryProcessorStub,
            resultProcessor: scanner => resultProcessorMock.object,
        };
        setupScannerUtilsMock(configStub.rules);

        const testSubject = new RuleAnalyzer(
            configStub,
            scannerUtilsMock.object,
            scopingStoreMock.object,
            sendMessageMock.object,
            dateGetterMock.object,
            telemetryDataFactoryMock.object,
            postResolveCallbackMock.object,
            scanIncompleteWarningDetectorMock.object,
            failTestOnErrorLogger,
        );

        const scanResults = createTestResults();

        const expectedMessage: Message = {
            messageType: configStub.analyzerMessageType,
            payload: {
                key: configStub.key,
                selectorMap: allInstancesMock,
                scanResult: scanResults,
                testType: typeStub,
                telemetry: expectedTelemetryStub,
                scanIncompleteWarnings: [],
            },
        };

        resultProcessorMock
            .setup(processor => processor(scanResults))
            .returns(() => allInstancesMock);
        const axeAnalyzerResults: AxeAnalyzerResult = {
            results: allInstancesMock,
            include: scopingState.selectors.include,
            exclude: scopingState.selectors.exclude,
            originalResult: scanResults,
        };

        postResolveCallbackMock
            .setup(m => m(axeAnalyzerResults))
            .callback(() => {
                postResolveCallbackMock.verifyAll();
                done();
            })
            .verifiable(Times.exactly(1));

        sendMessageMock
            .setup(sm => sm(It.isValue(expectedMessage)))
            .returns(() => {
                sendMessageMock.verifyAll();
            })
            .verifiable();

        dateMock
            .setup(mock => mock.getTime())
            .returns(_ => startTime)
            .verifiable();

        testSubject.analyze();

        dateMock.reset();
        dateMock
            .setup(mock => mock.getTime())
            .returns(_ => endTime)
            .verifiable();

        scanCallback(scanResults);
    }

    function setupScannerUtilsMock(rules: string[]): void {
        const getState = scopingStoreMock.object.getState();
        const include = getState.selectors[ScopingInputTypes.include];
        const exclude = getState.selectors[ScopingInputTypes.exclude];

        const scanOptions: ScanOptions = {
            testsToRun: rules,
            include: include,
            exclude: exclude,
        };

        scannerUtilsMock
            .setup((scanner: ScannerUtils) =>
                scanner.scan(It.isValue(scanOptions), It.is(isFunction)),
            )
            .callback((theRules: string[], callback: (results: ScanResults) => void) => {
                scanCallback = callback;
            })
            .verifiable(Times.once());
    }

    function createTestResults(): ScanResults {
        return {
            passes: [],
            violations: [],
            inapplicable: [],
            incomplete: [],
            timestamp: new Date().toString(),
            targetPageTitle: '',
            targetPageUrl: '',
        };
    }
});
