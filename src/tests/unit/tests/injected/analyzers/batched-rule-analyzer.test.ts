// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScopingInputTypes } from 'background/scoping-input-types';
import { ScopingStore } from 'background/stores/global/scoping-store';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { clone, isFunction } from 'lodash';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { RuleAnalyzerScanTelemetryData } from '../../../../../common/extension-telemetry-events';
import { Message } from '../../../../../common/message';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { ScopingStoreData } from '../../../../../common/types/store-data/scoping-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { RuleAnalyzerConfiguration } from '../../../../../injected/analyzers/analyzer';
import {
    BatchedRuleAnalyzer,
    IResultRuleFilter,
} from '../../../../../injected/analyzers/batched-rule-analyzer';
import { HtmlElementAxeResults, ScannerUtils } from '../../../../../injected/scanner-utils';
import { RuleResult, ScanResults } from '../../../../../scanner/iruleresults';
import { ScanOptions } from '../../../../../scanner/scan-options';
import { DictionaryStringTo } from '../../../../../types/common-types';

describe('BatchedRuleAnalyzer', () => {
    let scannerUtilsMock: IMock<ScannerUtils>;
    let dateGetterMock: IMock<() => Date>;
    let dateMock: IMock<Date>;
    let scopingStoreMock: IMock<ScopingStore>;
    let scopingState: ScopingStoreData;
    const allInstancesMocks: DictionaryStringTo<any> = {
        test: 'test-result-value',
    };
    let sendMessageMock: IMock<(message) => void>;
    let telemetryDataFactoryMock: IMock<TelemetryDataFactory>;
    let typeStub: VisualizationType;
    const scanCallbacks: ((results: ScanResults) => void)[] = [];
    let resultConfigFilterMock: IMock<IResultRuleFilter>;
    let scanIncompleteWarningDetectorMock: IMock<ScanIncompleteWarningDetector>;

    beforeEach(() => {
        typeStub = -1 as VisualizationType;
        sendMessageMock = Mock.ofInstance(message => {});
        resultConfigFilterMock = Mock.ofInstance((results, rules) => null);
        scannerUtilsMock = Mock.ofType(ScannerUtils);
        scopingStoreMock = Mock.ofType(ScopingStore);
        telemetryDataFactoryMock = Mock.ofType(TelemetryDataFactory);
        const dateStub = {
            getTime: () => {
                return null;
            },
        };
        scanIncompleteWarningDetectorMock = Mock.ofType<ScanIncompleteWarningDetector>();
        dateMock = Mock.ofInstance(dateStub as Date);
        dateGetterMock = Mock.ofInstance(() => null);
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

    function testGetResults(done: () => void): void {
        const key = 'sample key';
        const testName = 'sample test name';
        const telemetryProcessorStub = factory => (_, elapsedTime, __) => {
            return createTelemetryStub(elapsedTime, testName, key);
        };
        const startTime = 10;
        const endTime = 20;
        const expectedTelemetryStub = createTelemetryStub(endTime - startTime, testName, key);
        const ruleOne = 'the first rule';
        const resultOne: RuleResult = {
            id: ruleOne,
        } as RuleResult;
        const resultProcessorMockOne: IMock<
            (results: ScanResults) => DictionaryStringTo<HtmlElementAxeResults>
        > = Mock.ofInstance(results => null, MockBehavior.Strict);
        const configOne = {
            rules: [ruleOne],
            analyzerMessageType: 'sample message type',
            key,
            testType: typeStub,
            telemetryProcessor: telemetryProcessorStub,
            resultProcessor: scanner => resultProcessorMockOne.object,
        };
        const ruleTwo = 'the second rule';
        const resultProcessorMockTwo: IMock<
            (results: ScanResults) => DictionaryStringTo<HtmlElementAxeResults>
        > = Mock.ofInstance(results => null, MockBehavior.Strict);
        const configTwo = {
            ...clone(configOne),
            rules: [ruleTwo],
            resultProcessor: scanner => resultProcessorMockTwo.object,
        };
        const resultTwo: RuleResult = {
            id: ruleTwo,
        } as RuleResult;

        setupScannerUtilsMock(null, Times.exactly(2));

        const testSubjectOne = createAnalyzer(configOne);
        const testSubjectTwo = createAnalyzer(configTwo);

        const completeRuleResults = createTestRuleResultsWithResult([resultOne, resultTwo]);
        const scanResultsOne = createTestRuleResultsWithResult([resultOne]);
        const scanResultsTwo = createTestRuleResultsWithResult([resultTwo]);
        const firstExpectedMessage = getExpectedMessage(
            configOne,
            scanResultsOne,
            expectedTelemetryStub,
        );
        const secondExpectedMessage = getExpectedMessage(
            configTwo,
            scanResultsTwo,
            expectedTelemetryStub,
        );

        setupProcessingMocks(
            resultProcessorMockOne,
            configOne,
            completeRuleResults,
            scanResultsOne,
        );
        setupProcessingMocks(
            resultProcessorMockTwo,
            configTwo,
            completeRuleResults,
            scanResultsTwo,
        );

        const testSubjects = [testSubjectOne, testSubjectTwo];

        testSubjects.forEach((testSubject, index) => {
            dateMock.reset();
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

            sendMessageMock.reset();
            sendMessageMock.setup(sm => sm(It.isValue(firstExpectedMessage))).verifiable();

            sendMessageMock
                .setup(sm => sm(It.isValue(secondExpectedMessage)))
                .returns(() => {
                    sendMessageMock.verifyAll();
                    if (index + 1 === testSubjects.length) {
                        done();
                    }
                })
                .verifiable();

            scanCallbacks[index](completeRuleResults);
        });
    }

    function setupProcessingMocks(
        resultProcessorMock: IMock<
            (results: ScanResults) => DictionaryStringTo<HtmlElementAxeResults>
        >,
        config: RuleAnalyzerConfiguration,
        completeResults: ScanResults,
        filteredResults: ScanResults,
    ): void {
        resultProcessorMock
            .setup(processor => processor(It.isValue(completeResults)))
            .returns(() => null);

        resultProcessorMock
            .setup(processor => processor(It.isValue(filteredResults)))
            .returns(() => allInstancesMocks);

        resultConfigFilterMock
            .setup(rcfm => rcfm(It.isValue(completeResults), config.rules))
            .returns(() => filteredResults);
    }

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

    function setupScannerUtilsMock(rules: string[], times: Times): void {
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
            .callback((_: string[], callback: (results: ScanResults) => void) => {
                scanCallbacks.push(callback);
            })
            .verifiable(times);
    }

    function getExpectedMessage(
        config: RuleAnalyzerConfiguration,
        results: ScanResults,
        expectedTelemetryStub,
    ): Message {
        return {
            messageType: config.analyzerMessageType,
            payload: {
                key: config.key,
                selectorMap: allInstancesMocks,
                scanResult: results,
                testType: config.testType,
                telemetry: expectedTelemetryStub,
                scanIncompleteWarnings: [],
            },
        };
    }

    function createTestRuleResultsWithResult(result: RuleResult[]): ScanResults {
        return {
            passes: result,
            violations: result,
            inapplicable: result,
            incomplete: result,
            timestamp: new Date().toString(),
            targetPageTitle: '',
            targetPageUrl: '',
        };
    }

    function createAnalyzer(config: RuleAnalyzerConfiguration): BatchedRuleAnalyzer {
        return new BatchedRuleAnalyzer(
            config,
            scannerUtilsMock.object,
            scopingStoreMock.object,
            sendMessageMock.object,
            dateGetterMock.object,
            telemetryDataFactoryMock.object,
            resultConfigFilterMock.object,
            scanIncompleteWarningDetectorMock.object,
            failTestOnErrorLogger,
        );
    }
});
